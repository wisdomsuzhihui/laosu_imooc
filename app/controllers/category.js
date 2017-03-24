var Movie = require('../models/movie')
var Category = require('../models/category')
var _ = require('underscore') // 新字段替换老字段

// admin page
exports.new = function (req, res) {
  res.render('category_admin', {
    title: '老苏 后台分类录入页',
    category: {}
  })
}


// admin post movie
exports.save = function (req, res) {
  var _category = req.body.category
  var category = new Category(_category)

  category.save(function (err, category) {
    if (err) {
      console.log(err)
    }
    res.redirect('/admin/categorylist');
  })
}

// catelist page
exports.list = function (req, res) {
  Category.fetch(function (err, categories) {
    if (err) {
      console.log(err)
    }
    res.render('categorylist', {
      title: '老苏-分类列表',
      categories: categories
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