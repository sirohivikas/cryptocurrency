var express = require('express');
var router = express.Router();
var models = require('../models')
var config = require('../config/config')
var randomExt = require('random-ext')
global._ = require('underscore')

router.use('/users', require('./admin/users')) 
router.use('/crypto', require('./admin/crypto'))
//router.use('/classrooms',require('./admin/classrooms'))
//router.use('/chapters',require('./admin/chapters'))
//router.use('/lessons',require('./admin/lessons'))
//router.use('/home',require('./admin/home'))
//router.use('/payment',require('./admin/payment'))

module.exports = router
