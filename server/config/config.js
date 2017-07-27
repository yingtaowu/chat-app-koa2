const _ = require('lodash')
const development = require('./dev.env')
const production = require('./prod.env')

const env = process.env.NODE_ENV || 'development'
console.log(process.env.NODE_ENV)

const configs = {
  development: development,
  production: production
}

const defaultConfig = {
  env: env
}

console.log(env + JSON.stringify(defaultConfig))

// merge 组合两个对象成为一个对象
const config = _.merge(defaultConfig, configs[env])

module.exports = config