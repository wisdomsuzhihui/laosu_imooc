var Movie = require('../models/movie')
var Comment = require('../models/comment')
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
  res.render('catetory_admin', {
    title: '老苏 后台分类录入页',
  })
}


// admin post movie
exports.save = function (req, res) {
  var id = req.body.catetory._id
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