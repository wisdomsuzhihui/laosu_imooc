var _ = require('underscore') // 新字段替换老字段
var Index = require('../app/controllers/index')
var User = require('../app/controllers/user')
var Movie = require('../app/controllers/movie')
/*
  var sql = require('mssql')
  var config = {
    user: 'sa',
    password: '123456',
    server: 'localhost', // you can use 'localhost\\instance' to connect to named instance 
    database: 'itcastsim',
    options: {
      encrypt: false // Use this if you're on Windows Azure  
    }
  };
*/

module.exports = function (app) {


  // pre handle user 预处理用户状态
  app.use(function (req, res, next) {
    var _user = req.session.user
    app.locals.user = _user
    return next()
  })

  // Index
  app.get('/', Index.index)

  // User
  app.post('/user/signup', User.signup)
  app.post('/user/signin', User.signin)
  app.get('/logout', User.logout)
  app.get('/admin/userlist', User.userlist)

  // Movie
  app.get('/movie/:id', Movie.detail)
  app.get('/admin/new', Movie.new)
  app.get('/admin/update/:id', Movie.update)
  app.post('/admin/movie', Movie.save)
  app.get('/admin/list', Movie.list)
  app.delete('/admin/list', Movie.del)
}