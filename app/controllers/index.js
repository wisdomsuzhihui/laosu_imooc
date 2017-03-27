var Movie = require('../models/movie')
var Category = require('../models/category')
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

  Category
    .find({})
    .populate({
      path: 'movies',
      options: {
        limit: 5
      }
    })
    .exec(function (err, categories) {
      // body
      if (err) {
        console.log(err)
      }

      res.render('index', {
        title: '老苏 首页',
        categories: categories
      })
    })
}
// search page
exports.search = function (req, res) {
  console.log('user in session:')
  console.log(req.session.user)

  var catId = req.query.cat
  var q = req.query.q
  var page = parseInt(req.query.p, 10) || 0
  var count = 2
  var index = page * count

  if (catId) {

    Category
      .find({
        _id: catId
      })
      .populate({
        path: 'movies',
        select: 'title poster',
        // options: {
        //   limit: 2,
        //   skip: index
        // }
      })
      .exec(function (err, categories) {
        // body
        if (err) {
          console.log(err)
        }
        var category = categories[0] || {}
        var movies = category.movies || {}
        var results = movies.slice(index, index + count)


        res.render('results', {
          title: '老苏 结果列表',
          keyword: category.name,
          currentPage: (page + 1),
          query: 'cat=' + catId,
          totalPage: Math.ceil(movies.length / count),
          movies: results
        })
      })
  } else {
    Movie
      .find({
        title: new RegExp(q + '.*', 'i')
      })
      .exec(function (err, movies) {
        if (err) {
          console.log(err)
        }
        var results = movies.slice(index, index + count)

        res.render('results', {
          title: '老苏 结果列表页面',
          keyword: q,
          currentPage: (page + 1),
          query: 'q=' + q,
          totalPage: Math.ceil(movies.length / count),
          movies: results
        })

      })
  }
}