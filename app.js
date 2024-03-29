var express = require('express')
var path = require('path')
var sql = require('mssql')
var mongoose = require('mongoose')

var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var mongoStore = require('connect-mongo')(session)
var logger = require('morgan')
var serveStatic = require('serve-static')
// http://docs.sequelizejs.com/en/v3/
var Sequelize = require('sequelize');
var fs = require('fs')
var Movie = require('./app/models/movie')
// var User = require('./app/models/user/user')
var port = process.env.PORT || 3000
var app = express()
var dbUrl = 'mongodb://localhost/imooc'
// var db = require('./db1');
mongoose.connect(dbUrl)

// models loading
var models_path = __dirname + '/app/models' // 模型所在路径
// 路径加载函数，加载各模型的路径,所以可以直接通过mongoose.model加载各模型 这样即使模型路径改变也无需更改路径
var walk = function (path) {
  fs
    .readdirSync(path)
    .forEach(function (file) {
      var newPath = path + '/' + file
      var stat = fs.statSync(newPath)

      if (stat.isFile()) {
        if (/(.*)\.(js|coffe)/.test(file)) {
          require(newPath)
        }
      } else if (stat.isDirectory()) {
        walk(newPath)
      }
    })
}
walk(models_path) // 加载模型所在路径


var sequelize = new Sequelize('ItcastSIM', 'sa', '123456', {
  host: '127.0.0.1',
  dialect: 'mssql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
})

// var User = sequelize.define('user', {
//   username: Sequelize.STRING,
//   birthday: Sequelize.DATE
// });
// 同步创建数据
// sequelize.sync().then(function () {
//   return User.create({
//     username: 'laosu',
//     birthday: new Date(1985, 6, 20)
//   });
// }).then(function (laosu) {
//   console.log(laosu.get({
//     plain: true
//   }))
// })



app.set('views', './app/views/pages')
app.set('view engine', 'jade')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))

// parse application/json
app.use(bodyParser.json())


app.use(cookieParser())
// app.use(multipart())
app.use(session({
  secret: 'laosu', // 设置的secret字符串，来计算hash值并放在cookie中
  resave: false, // session变化才进行存储
  saveUninitialized: true,
  // 使用mongo对session进行持久化，将session存储进数据库中
  store: new mongoStore({
    url: dbUrl,
    collection: 'sessions' // 存储到mongodb中的字段名
  })
}))

// development: 开发环境
var env = process.env.NODE_ENV || 'development'
if ('development' === env) {
  app.set('showStackError', true)
  app.use(logger(':method :url :status'))
  app.locals.pretty = true // 源码格式化，不要压缩
  mongoose.set('debug', true)
}


require('./config/routes')(app)

app.use(serveStatic(path.join(__dirname, 'public')))
app.locals.moment = require('moment')
app.listen(port)

console.log('laosu website started on port ' + port)
// https://github.com/Loogeek/douban_Website.git