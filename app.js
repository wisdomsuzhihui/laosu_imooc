var express = require('express')
var path = require('path')
var sql = require('mssql')
var mongoose = require('mongoose')
var mongoStore = require('connect-mongo')(express)
var _ = require('underscore') // 新字段替换老字段
// http://docs.sequelizejs.com/en/v3/
var Sequelize = require('sequelize');

var Movie = require('./app/models/movie')
var User = require('./app/models/user')
var port = process.env.PORT || 3000
var app = express()
var dbUrl = 'mongodb://localhost/imooc'
// var db = require('./db1');
mongoose.connect(dbUrl)

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
app.use(express.bodyParser())
app.use(express.cookieParser())
app.use(express.session({
  secret: 'laosu',
  store: new mongoStore({
    url: dbUrl,
    collection: 'sessions'
  })
}))

// development: 开发环境
if ('development' === app.set('env')) {
  app.set('showStackError', true)
  app.use(express.logger(':method :url :status'))
  app.locals.pretty = true
  mongoose.set('debug', true)
}


require('./config/routes')(app)

app.use(express.static(path.join(__dirname, 'public')))
app.locals.moment = require('moment')
app.listen(port)

console.log('laosu website started on port ' + port)