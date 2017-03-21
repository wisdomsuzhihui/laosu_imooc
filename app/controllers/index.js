var Movie = require('../models/movie')
/**
 * 控制器
 */
// index page
/*
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
*/
exports.index = function (req, res) {
  console.log('user in session:')
  console.log(req.session.user)

  Movie.fetch(function (err, movies) {
    if (err) {
      console.log(err)
    }

    res.render('index', {
      title: '老苏 首页',
      movies: movies
    })

  })
}