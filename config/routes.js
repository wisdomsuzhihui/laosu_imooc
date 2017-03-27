var Index = require('../app/controllers/index'),
  User = require('../app/controllers/user/user'),
  Movie = require('../app/controllers/movie'),
  Comment = require('../app/controllers/comment'),
  Category = require('../app/controllers/category'),

  // 处理文件上传中间件
  multipart = require('connect-multiparty'),
  multipartMiddleware = multipart()
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
    // 将session中保存的用户名存储到本地变量中
    app.locals.user = req.session.user
    return next()
  })


  /*============== 公共路由 ==============*/


  // Index
  app.get('/', Index.index)

  // User
  app.post('/user/signup', User.signup)
  app.post('/user/signin', User.signin)
  app.get('/signin', User.showSignin)
  app.get('/user/signup', User.showSignup)
  app.get('/logout', User.logout)
  app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.userlist)

  // Movie
  app.get('/movie/:id', Movie.detail)
  app.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new)
  app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update)
  app.post('/admin/movie', multipartMiddleware, User.signinRequired, User.adminRequired, Movie.savePoster, Movie.save)
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