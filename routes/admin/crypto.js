var express = require('express');
var router = express.Router();
var models = require('../../models')
var md5 = require('md5')
global._ = require('underscore')
var request = require('request');
var async = require('async');
global.fetch = require('node-fetch');
var cc = require('cryptocompare');
var schedule = require('node-schedule');

schedule.scheduleJob('*/5 * * * *', function(){
    console.log('The cron job for coinlist started executeed every 5 mins!');
    request.get('http://localhost:3000/v1/admin/crypto', function(err,result) {
    });
});

schedule.scheduleJob('*/10 * * * *', function(){
  console.log('The cron job for historical price started, executeed every 10 mins!');
  request.get('http://localhost:3000/v1/admin/crypto/fetchHistoricalData', function(err,result) {
  });
});

router.get('/', (req, res) => {
  
  // Function to get coinlist and save that into db, if exist then update
  request.get('https://www.cryptocompare.com/api/data/coinlist/', function(err,result) {
    if(err){
        res.json({"message":err});
    } else {
      
        var coinlist = JSON.parse(result.body);
      
        async.waterfall([
      
          function(cb){
            var coinlistdata;
           
            async.forEachOf(coinlist, function (value, key, callback) {
               
             if(key == "Data"){
                coinlistdata = value;
             }  
             callback(); 
         
            }, function (err) {
                if (err) { return cb({
                            code: -4,
                            message: "Invalid data response"
                     }) 
                 } else {
                   console.log("final call");
                   cb(null, coinlistdata);
                }
            });
          },

          function(coinlistdata, cb){
          
            async.each(coinlistdata, function (dataset, callback) {
            
                models.coinlist.findOne({
                    where: {
                        Name: dataset.Name
                    }
                }).then(function(result) {

                    if(result==null){
                      console.log("CoinList Being  Save", dataset.Id+"--"+dataset.Name);
                       models.coinlist.create({
                            Ids: dataset.Id,
                            Url: dataset.Url,
                            ImageUrl: dataset.ImageUrl,
                            Name: dataset.Name,
                            Symbol: dataset.Symbol,
                            CoinName: dataset.CoinName,
                            FullName: dataset.FullName,
                            Algorithm: dataset.Algorithm,
                            ProofType: dataset.ProofType,
                            FullyPremined:dataset.FullyPremined,
                            TotalCoinSupply: dataset.TotalCoinSupply,
                            PreMinedValue: dataset.PreMinedValue,
                            TotalCoinsFreeFloat: dataset.TotalCoinsFreeFloat,
                            SortOrder: dataset.SortOrder,
                            Sponsored: dataset.Sponsored
                      });
                    } else {
                      console.log("CoinList Being Update", result.Ids+"--"+result.Name);
                      models.coinlist.update({
                            Url: result.Url,
                            ImageUrl: result.ImageUrl,
                            Name: result.Name,
                            Symbol: result.Symbol,
                            CoinName: result.CoinName,
                            FullName: result.FullName,
                            Algorithm: result.Algorithm,
                            ProofType: result.ProofType,
                            FullyPremined:result.FullyPremined,
                            TotalCoinSupply: result.TotalCoinSupply,
                            PreMinedValue: result.PreMinedValue,
                            TotalCoinsFreeFloat: result.TotalCoinsFreeFloat,
                            SortOrder: result.SortOrder,
                            Sponsored: result.Sponsored
                      },{
                          where: {
                             Ids:result.Ids
                          }
                      })
                    }

                }).catch(function(err) {
                    console.log(err)
                })

                setTimeout(callback, 0);
                               
             }, function (err) {
                 if (err) { return cb({
                            code: -4,
                            message: "Invalid data response"
                     }) 
                 } else {
                   cb(null, {"message":"Coinlist data has been saved in the database"});
                }
             });
           
           }], function(err, result){
            if (err){
              res.status(400).json({
                code: 0,
                data: err
              })
            }
            else {
            
              res.json(result);
            }
      })
    }
   
 });

});


// Function to get HistoricalData based on coinlist and save that back to mysql "historicalprice" table , create a new row if coinname is not the table, update if exist
router.get('/fetchHistoricalData', (req, res) => {
    console.log("in the Historical function");
    async.waterfall([
          
          function(cb){
            
            models.coinlist.findAll({})
             .then(function(coin) {
                    cb(null, coin);
              }).catch(function(err) {
                return cb({
                    code: 0,
                    data: err
                })
             })
          },

          function(coinlistdata, cb){

            async.each(coinlistdata, function (dataset, callback) {
                console.log("====> "+dataset.Name);
                request.get("https://min-api.cryptocompare.com/data/pricehistorical?fsym="+dataset.Name+"&tsyms=BTC,USD,EUR", function(err,result) {
                 
                  models.historicalprice.findOne({
                    where: {
                        coinname: dataset.Name
                    }
                }).then(function(rowset) {

                    if(rowset==null){

                       if(result!=undefined && result.body!=undefined){ 
                            var parsedataset = JSON.parse(result.body)
                            if(result!=undefined && parsedataset.Response!="Error"){
                               for (var key in parsedataset) {
                                   console.log("Historical Table Save Operation ==> key: %o, value: %o", key, parsedataset[key])
                                   models.historicalprice.create({
                                    coinname: key,
                                    value: JSON.stringify(parsedataset[key])
                                   });
                               }
                            }
                       }  

                    } else {
                      
                      if(result!=undefined && result.body!=undefined){ 
                            var parsedataset = JSON.parse(result.body)
                            if(result!=undefined && parsedataset.Response!="Error"){
                               for (var key in parsedataset) {
                                   console.log("Historical Table Update Operation ==> key: %o, value: %o", key, parsedataset[key])
                                   models.historicalprice.update({
                                    coinname: key,
                                    value: JSON.stringify(parsedataset[key])
                                   },{
                                    where: {
                                       coinname:rowset.coinname
                                    }
                                });
                               }
                            }
                       }  

                    }

                }).catch(function(err) {
                    console.log(err)
                })
                  setTimeout(callback, 0);
              }) 
                               
             }, function (err) {
                 if (err) { return cb({
                            code: -4,
                            message: "Invalid data response"
                     }) 
                 } else {
                   cb(null, {"message":"Historical data has been saved in the database"});
                }
             });

          }], function(err, result){
            if (err){
              res.status(400).json({
                code: 0,
                data: err
              })
            }
            else {
              res.json(result);
            }
         })
})


module.exports = router
