var Movie = require('../models/movie')
var Comment = require('../models/comment')
var Category = require('../models/category')
var _ = require('underscore') // 新字段替换老字段


// detail page
exports.detail = function (req, res) {
  var id = req.params.id

  Movie.findById(id, function (err, movie) {
    /* 
       Comment.find({
         movie: id
       }, function (err, comments) {
         // console.log(comments)
         res.render('detail', {
           title: '老苏 详情页' + movie.title,
           movie: movie,
           comments: comments
         })
       })
     */
    Comment
      .find({
        movie: id
      })
      .populate('from', 'name')
      .populate('reply.from reply.to', 'name')
      .exec(function (err, comments) {
        console.log(comments)
        res.render('detail', {
          title: '老苏 详情页' + movie.title,
          movie: movie,
          comments: comments
        })
      })
  })
}
// admin page
exports.new = function (req, res) {
  Category.find({}, function (err, categories) {
    res.render('admin', {
      title: '老苏 后台录入页',
      categories: categories,
      movie: {}
    })
  })
}


// admin update movie 
exports.update = function (req, res) {
  var id = req.params.id
  if (id) {
    Movie.findById(id, function (err, movie) {
      Category.find({}, function (err, categories) {
        res.render('admin', {
          title: 'imooc 后台录入页',
          movie: movie,
          categories: categories
        })
      })
    })
  }
}

// admin post movie
exports.save = function (req, res) {
  var id = req.body.movie._id
  var movieObj = req.body.movie
  var _movie
  // 数据库已这条记录
  if (id) {
    console.log('数据库已有这条记录 ==================')
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
    console.log('数据库已这条记录 ==================')
    /* // 一期代码
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
    */
    _movie = new Movie(movieObj)
    // 选择的电影分类 id
    var categoryId = movieObj.category,
      categoryName = movieObj.categoryName
    _movie.save(function (err, movie) {
      if (err) {
        console.log(err)
      }
      if (categoryId) {
        // 根据分类id存入当前输入的电影ID
        Category.findById(categoryId, function (err, category) {
          category.movies.push(movie._id)

          category.save(function (err, category) {
            res.redirect('/movie/' + movie._id);

          })
        })

      } else if (categoryName) {
        // 新增分类
        var category = new Category({
          name: categoryName,
          movies: [movie._id]
        })

        category.save(function (err, category) {
          movie.category = category._id
          movie.save(function (err, movie) {
            res.redirect('/movie/' + movie._id);

          })

        })
      }
    })
  }
}

// list page
exports.list = function (req, res) {
  Movie.fetch(function (err, movies) {
    if (err) {
      console.log(err)
    }

    res.render('list', {
      title: '老苏列表',
      movies: movies
    })
  })
}

// list delete movie
exports.del = function (req, res) {
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
}