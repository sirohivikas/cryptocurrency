var env = require('node-env')
var config = {
    development: {
        baseUrl: 'http://localhost:4000/',
        port: 3000,
        database: {
            driver: "mysql",
            username: "root",
            database: "cryptocurrency",
            password: "",
            location: "localhost"
        }
    },
    production: {
        baseUrl: 'http://localhost:4000/',
        port: 3000,
        database: {
            driver: "mysql",
            username: "root",
            database: "cryptocurrency",
            password: "",
            location: "localhost"
        }
    }
}

console.log('env is ' + env)

module.exports = config[env || 'development']
