var express = require('express');
var router = express.Router();
var models = require('../../models')
var md5 = require('md5')
global._ = require('underscore')
var request = require('request');
var async = require('async');


router.get('/', (req, res) => {
 
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
          
            var i = 0;
            async.each(coinlistdata, function (dataset, callback) {
            
            if(i<10){  // Added this condition due to Maximum call stack size exceeded issue || I am working to resolve it
             console.log(coinlistdata);
               i++;
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
                callback();
            }
                               
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







})

router.post('/', (req, res) => {
      console.log("post method");
})


module.exports = router
