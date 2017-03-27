  var User = require('../../models/user/user')

  /* 用户注册页面渲染控制器 */
  exports.showSignup = function (req, res) {
    res.render('signup', {
      title: '注册页面',
    })
  }

  // signin
  exports.showSignin = function (req, res) {
    res.render('signin', {
      title: '登录页面',
    })
  }

  // signup
  exports.signup = function (req, res) {
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


    User.findOne({
      name: _user.name
    }, function (err, user) {
      if (err) {
        console.log(err)
      }

      if (user) {
        return res.redirect('/signin')
      } else {
        var user = new User(_user);
        user.save(function (err, user) {
          if (err) {
            console.log(err)
          }
          // console.log(user)
          res.redirect('/')
        })
      }

    })
  }

  // signin
  exports.signin = function (req, res) {
    var user = req.query.user || '',
      _user = {}
    console.log('laosu===============' + user)
    user = user.split('&')
    for (var i = 0; i < user.length; i++) {
      var p = user[i].indexOf('='),
        name = user[i].substring(0, p),
        value = user[i].substring(p + 1)
      _user[name] = value;
    }

    var _name = _user.name || '',
      _password = _user.password || ''

    User.findOne({
      name: _name
    }, function (err, user) {
      if (err) {
        console.log(err)
      }
      if (!user) {
        return res.redirect('/user/signup')
      }
      // 实例方法
      user.comparePassword(_password, function (err, isMatch) {
        if (err) {
          console.log(err);
        }
        if (isMatch) {
          // console.log('Password is matched!')
          req.session.user = user; // 保存登录状态
          console.log(req.session.user)
          return res.redirect('/');
        } else {
          return res.redirect('/signin')
        }
      })

    })
  }

  // logout
  exports.logout = function (req, res) {
    delete req.session.user
    // delete app.locals.user
    res.redirect('/')
  }

  // userlist page
  exports.userlist = function (req, res) {
    User.fetch(function (err, users) {
      if (err) {
        console.log(err)
      }
      res.render('userlist', {
        title: '用户列表',
        users: users
      })
    })
  }

  // midware for user 中间件
  exports.signinRequired = function (req, res, next) {
    var user = req.session.user
    if (!user) {
      return res.redirect('/signin')
    }
    next()
  }

  // midware for user 中间件
  exports.adminRequired = function (req, res, next) {
    var user = req.session.user
    if (user.role <= 10) {
      return res.redirect('/signin')
    }
    next()
  }