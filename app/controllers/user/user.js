  var mongoose = require('mongoose'),
    User = mongoose.model('User')



  /* 用户登录页面渲染控制器 */
  exports.showSignin = function (req, res) {
    res.render('user/signin', {
      title: '登录页面',
    })
  }

  /* 用户注册控制器 */
  exports.signup = function (req, res) {
    console.log('=================')
    console.log(req.body)
    var _user = req.body
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


  /* 用户注册页面渲染控制器 */
  exports.showSignup = function (req, res) {
    res.render('user/signup', {
      title: '注册页面',
    })
  }

  /* 用户登陆控制器 */
  exports.signin = function (req, res) {
    // var user = req.query.user || '',
    //   _user = {}
    // user = user.split('&')
    // for (var i = 0; i < user.length; i++) {
    //   var p = user[i].indexOf('='),
    //     name = user[i].substring(0, p),
    //     value = user[i].substring(p + 1)
    //   _user[name] = value;
    // }

    var _name = req.query.name || '',
      _password = req.query.password || ''

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

  /* 用户登出控制器 */
  exports.logout = function (req, res) {
    delete req.session.user
    res.redirect('/')
  }

  /* 用户列表页面渲染控制器 */
  exports.list = function (req, res) {
    User.fetch(function (err, users) {
      if (err) {
        console.log(err)
      }
      res.render('user/user_list', {
        title: '用户列表',
        users: users
      })
    })
  }

  /* 用户列表删除电影控制器 */
  exports.del = function (req, res) {
    // 获取客户端Ajax发送的URL值中的id值
    var id = req.query.id;
    if (id) {
      // 如果id存在则服务器中将该条数据删除并返回删除成功的json数据
      User.remove({
        _id: id
      }, function (err) {
        if (err) {
          console.log(err);
        }
        res.json({
          success: 1
        }); // 删除成功
      });
    }
  };

  /* 用户是否登陆判断中间件 */
  exports.signinRequired = function (req, res, next) {
    var user = req.session.user
    if (!user) {
      return res.redirect('/signin')
    }
    next()
  }

  /* 用户权限中间件 */
  exports.adminRequired = function (req, res, next) {
    var user = req.session.user
    if (user.role <= 10) {
      return res.redirect('/signin')
    }
    next()
  }