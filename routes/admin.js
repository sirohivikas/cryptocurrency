var express = require('express');
var router = express.Router();
var models = require('../models')
var config = require('../config/config')
var randomExt = require('random-ext')
global._ = require('underscore')

router.use('/users', require('./admin/users')) 
router.use('/crypto', require('./admin/crypto'))


module.exports = router
