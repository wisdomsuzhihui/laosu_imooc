  var User = require('../models/user')
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
  }

  // signin
  exports.signin = function (req, res) {
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