var app = new (require('koa'))()
var mongoose = require('mongoose')
var bodyParser = require('body-parser') //是一个非常常用的express中间件,对post请求的请求体进行解析
var cookieParser = require('cookie-parser') //用于获取web浏览器发送的cookie中的内容
var session = require('cookie-session')
mongoose.Promise = require('bluebird') //bluebird提供了一个非常有用的功能来promise化不返回promise的模块
global.db = mongoose.connect("mongodb://localhost:27017/vuechat")

app.use(bodyParser.json()) //服务器提交的数据json化
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser()) //sesstion 存储
app.use(session({
  secret: 'vuechat',
  resave: false,
  saveUninitialized: true
}))

module.exports = function(app){
  var env = process.env.NODE_ENV || 'development'
  if ('development' === app.get('env')) {
     app.set('showStackError', true)
     app.locals.pretty = true
     mongoose.set('debug', true)
   }  
}

