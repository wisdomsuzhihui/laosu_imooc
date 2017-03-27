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
var User = require('./app/models/user')
var port = process.env.PORT || 3000
var app = express()
var dbUrl = 'mongodb://localhost/imooc'
// var db = require('./db1');
mongoose.connect(dbUrl)

// models loading
var models_path = __dirname + '/app/models'
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
walk(models_path)


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
  secret: 'laosu',
  resave: false,
  saveUninitialized: true,
  store: new mongoStore({
    url: dbUrl,
    collection: 'sessions'
  })
}))

// development: 开发环境
var env = process.env.NODE_ENV || 'development'
if ('development' === env) {
  app.set('showStackError', true)
  app.use(logger(':method :url :status'))
  app.locals.pretty = true
  mongoose.set('debug', true)
}


require('./config/routes')(app)

app.use(serveStatic(path.join(__dirname, 'public')))
app.locals.moment = require('moment')
app.listen(port)

console.log('laosu website started on port ' + port)
// https://github.com/Loogeek/douban_Website.git