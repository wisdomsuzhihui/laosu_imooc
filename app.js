var express = require('express')
var port = process.env.PORT || 3000
var app = express()

app.set('views', './views/page')
app.set('view engine', 'jade')
app.listen(port)

console.log('laosu website started on port ' + port)

// index page
app.get('/', function (req, res) {
  res.render('index', {
    title: '老苏 首页'
  })
})

// detail page
app.get('/movie/:id', function (req, res) {
  res.render('detail', {
    title: '老苏 详情页'
  })
})
// admin page
app.get('/admin/movie', function (req, res) {
  res.render('admin', {
    title: '老苏 后台录入页'
  })
})
// list page
app.get('/admin/list', function (req, res) {
  res.render('list', {
    title: '老苏列表'
  })
})