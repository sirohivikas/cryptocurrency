var express = require('express');
var router = express.Router();

router.use('/admin', require('./routes/admin'));
//router.use('/', require('./routes/admin'));

module.exports = router;
  