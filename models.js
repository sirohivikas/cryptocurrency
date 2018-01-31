var fs = require("fs");
var path = require("path");
var db = {};
var Sequelize = require('sequelize');
var config = require('./config/config').database;

var sequelize = new Sequelize(
    config.database,
    config.username,
    config.password, {
        host: config.location,
        dialect: config.driver,
        logging: false
    }
);

fs
    .readdirSync(__dirname + '/models')
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js") && file.indexOf('.js') > 0
    })
    .forEach(function(file) {
        var model = sequelize["import"](path.join(__dirname + '/models', file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
