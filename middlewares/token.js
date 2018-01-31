var jwt = require('jwt-simple')
var config = require('../config/config')
var models = require('../models')

module.exports = function(req, res, next) {

    if (req.url.indexOf('/auth') == 0 || req.url.indexOf('/getad/') == 0)
        return next()

    if(req.url.indexOf('/admin/payment/payat')==0){
        //TODO check credentials
        return next()
    }


    if (!req.headers['x-access-token'] && !req.body['access-token']) {
        return res.status(401).json({
            code: -1,
            message: 'no token'
        })
    }

    var token = req.headers['x-access-token'] || req.body['access-token']

    try {
        var payload = jwt.decode(token, config.secret)
    } catch (err) {
        return res.status(401).json({
            code: -1,
            message: 'invalid token'
        })
    }

    // if (payload.exp < Date.now()) {
    //     return res.status(401).json({
    //         code: -1,
    //         message: 'token expired'
    //     })
    // }

    var type = payload.user.type

    if (type == 'institution')
        return next()

    models[type].findOne({
            where: {
                id: payload.user.id,
                device_id: req.headers['x-access-deviceid']
            }
        })
        .then(function(user) {
            if (!user)
                return res.status(401).json({
                    code: -1,
                    message: 'no user'
                })
            req.user = user.toJSON()
            req.type = type
            req.user.type = type
            return next()
        })
        .catch(function(err) {
            return res.status(401).json({
                code: -1,
                message: 'invalid user'
            })
        })
}
