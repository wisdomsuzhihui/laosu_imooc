var _ = require('underscore') // 新字段替换老字段
var Index = require('../app/controllers/index')
var User = require('../app/controllers/user')
var Movie = require('../app/controllers/movie')
var Comment = require('../app/controllers/comment')
var Category = require('../app/controllers/category')
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
  app.get('/signin', User.showSignin)
  app.get('/signup', User.showSignup)
  app.get('/logout', User.logout)
  app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.userlist)

  // Movie
  app.get('/movie/:id', Movie.detail)
  app.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new)
  app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update)
  app.post('/admin/movie', User.signinRequired, User.adminRequired, Movie.savePoster, Movie.save)
  app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list)
  app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del)

  //Comment
  app.post('/user/comment', User.signinRequired, Comment.save)

  //category
  app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new)
  app.post('/admin/category', User.signinRequired, User.adminRequired, Category.save)
  app.get('/admin/categorylist', User.signinRequired, User.adminRequired, Category.list)

  //results
  app.get('/results', Index.search)
}