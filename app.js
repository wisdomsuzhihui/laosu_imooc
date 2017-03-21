var express = require('express')
var path = require('path')
var sql = require('mssql')
var mongoose = require('mongoose')
var mongoStore = require('connect-mongo')(express)
var _ = require('underscore') // 新字段替换老字段
// http://docs.sequelizejs.com/en/v3/
var Sequelize = require('sequelize');

var Movie = require('./models/movie')
var User = require('./models/user')
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




app.set('views', './views/pages')
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
app.use(express.static(path.join(__dirname, 'public')))
app.locals.moment = require('moment')
app.listen(port)

console.log('laosu website started on port ' + port)


var config = {
  user: 'sa',
  password: '123456',
  server: 'localhost', // you can use 'localhost\\instance' to connect to named instance 
  database: 'itcastsim',
  options: {
    encrypt: false // Use this if you're on Windows Azure  
  }
};



// index page
app.get('/', function (req, res) {
  // sql.connect('select * from UserInfo', function () {
  // })
  sql.connect(config).then(function () {
    new sql.Request()
      // .input('input_parameter', sql.Int, 1002)
      .query('select * from Classes').then(function (recordset) {
        // console.dir(recordset)
        console.log('user in session:')
        console.log(req.session.user)
        var _user = req.session.user
        if (_user) {
          app.locals.user = _user
        }
        Movie.fetch(function (err, movies) {
          if (err) {
            console.log(err)
          }

          res.render('index', {
            title: '老苏 首页',
            movies: movies
          })

        })

        // res.json(recordset)
      }).catch(function (err) {
        console.log(err);
        res.send(err);
      })
  }).catch(function (err) {
    console.log(err);
    res.send(err)
  })




})

// signup
app.post('/user/signup', function (req, res) {
  var _user = req.body.user
  // console.log(_user)
  /**
   * 1. req.body.user
   * 2. req.param('user') // 都可以使用
   * eg: url='/user/signup/:userid'
   * var _userid = req.params.userid
   * eg: url='/user/signup/1111?userid=1112
   * var _userid = req.query.userid
   * eg: ajax 提交
   * var _userid = req.body.userid
   */


  User.find({
    name: _user.name
  }, function (err, user) {
    if (err) {
      console.log(err)
    }

    if (user.length) {
      return res.redirect('/')
    } else {
      var user = new User(_user);
      user.save(function (err, user) {
        if (err) {
          console.log(err)
        }
        // console.log(user)
        res.redirect('/admin/userlist')
      })
    }

  })
})

// signin
app.post('/user/signin', function (req, res) {
  var _user = req.body.user
  var name = _user.name
  var password = _user.password

  User.findOne({
    name: name
  }, function (err, user) {
    if (err) {
      console.log(err)
    }
    if (!user) {
      return res.redirect('/')
    }
    // 实例方法
    user.comparePassword(password, function (err, isMatch) {
      if (err) {
        console.log(err);
      }
      if (isMatch) {
        // console.log('Password is matched!')
        req.session.user = user; // 保存登录状态

        return res.redirect('/');
      } else {
        console.log('Password is not matched')
      }
    })

  })
})

// logout
app.get('/logout', function (req, res) {
  delete req.session.user
  delete app.locals.user
  res.redirect('/')
})

// userlist page
app.get('/admin/userlist', function (req, res) {
  User.fetch(function (err, users) {
    if (err) {
      console.log(err)
    }
    res.render('userlist', {
      title: '用户列表',
      users: users
    })
  })
})

// detail page
app.get('/movie/:id', function (req, res) {
  var id = req.params.id
  Movie.findById(id, function (err, movie) {
    res.render('detail', {
      title: '老苏 详情页' + movie.title,
      movie: movie
    })
  })
})
// admin page
app.get('/admin/movie', function (req, res) {
  res.render('admin', {
    title: '老苏 后台录入页',
    movie: {
      title: '',
      doctor: '',
      country: '',
      year: '',
      poster: '',
      flash: '',
      summary: '',
      language: '',
    }
  })
})

// admin update movie 
app.get('/admin/update/:id', function (req, res) {
  var id = req.params.id
  if (id) {
    Movie.findById(id, function (err, movie) {
      res.render('admin', {
        title: 'imooc 后台录入页',
        movie: movie
      })
    })
  }
})

// admin post movie
app.post('/admin/movie/new', function (req, res) {
  var id = req.body.movie._id
  var movieObj = req.body.movie
  var _movie
  // 数据库已这条记录
  if (id !== 'undefined') {
    Movie.findById(id, function (err, movie) {
      if (err) {
        console.log(err)
      }
      _movie = _.extend(movie, movieObj)
      _movie.save(function (err, movie) {
        if (err) {
          console.log(err)
        }
        res.redirect('/movie/' + movie._id);
      })
    })
  } else {
    _movie = new Movie({
      doctor: movieObj.doctor,
      title: movieObj.title,
      country: movieObj.country,
      language: movieObj.language,
      year: movieObj.year,
      poster: movieObj.poster,
      summary: movieObj.summary,
      flash: movieObj.flash
    })

    _movie.save(function (err, movie) {
      if (err) {
        console.log(err)
      }
      res.redirect('/movie/' + movie._id);
    })
  }
})

// list page
app.get('/admin/list', function (req, res) {
  Movie.fetch(function (err, movies) {
    if (err) {
      console.log(err)
    }

    res.render('list', {
      title: '老苏列表',
      movies: movies
    })
  })
})

// list delete movie
app.delete('/admin/list', function (req, res) {
  var id = req.query.id
  if (id) {
    Movie.remove({
      _id: id
    }, function (err, movie) {
      if (err) {
        console.log(err)
      } else {
        res.json({
          success: 1
        })
      }
    })
  }
})