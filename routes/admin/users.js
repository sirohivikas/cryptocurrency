var express = require('express');
var router = express.Router();
var models = require('../../models')
var md5 = require('md5')
global._ = require('underscore')

router.get('/', (req, res) => {
    console.log("get method");
})

router.post('/', (req, res) => {
      console.log("post method");
})


module.exports = router
