var express = require('express')
var path = require('path')
var port = process.env.PORT || 3000
var app = express()
var sql = require('mssql')
// var db = require('./db1');

app.set('views', './views/pages')
app.set('view engine', 'jade')
app.use(express.bodyParser())
app.use(express.static(path.join(__dirname, 'bower_components')))
app.listen(port)

console.log('laosu website started on port ' + port)

var db = require('./db1');

var config = {
  user: 'sa',
  password: '123456',
  server: 'localhost', // You can use 'localhost\\instance' to connect to named instance 
  database: 'ItcastSIM',

  options: {
    encrypt: false // Use this if you're on Windows Azure  
  }
};



// index page
app.get('/', function (req, res) {
  // sql.connect('select * from UserInfo', function () {

  // })
  sql.connect(config).then(function(){
    new sql.Request()
      .input('input_parameter', sql.Int, 1002)
      .query('select * from Classes').then(function(recordset){
        console.dir(recordset)
        res.render('index', {
          title: '老苏 首页',
          movies: [{
            title: '老苏测试',
            _id: 1,
            poster: 'http://r1.ykimg.com/050C000058CE018AADC0B0058B0B2293'
          }]
        })
        // res.json(recordset)
      }).catch(function(err){
        console.log(err);
        res.send(err);
      })
  }).catch(function(err){
    console.log(err);
    res.send(err)
  })



})

// detail page
app.get('/movie/:id', function (req, res) {
  res.render('detail', {
    title: '老苏 详情页',
    movie: {
      doctor: '老苏',
      country: '中国',
      title: '群胡子',
      year: 2014,
      poster: 'http://r1.ykimg.com/050C000058CE018AADC0B0058B0B2293',
      language: '英语',
      flash: 'http://player.youku.com/player.php/sid/XMjY0NDQ1NzcwOA==/v.swf',
      summary: '只要不是一线演员演的古装悬疑剧我觉得都是好剧，热血长安，神探狄仁杰，有同感的都点个赞吧,只要不是一线演员演的古装悬疑剧我觉得都是好剧，热血长安，神探狄仁杰，有同感的都点个赞吧'
    }
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
// list page
app.get('/admin/list', function (req, res) {
  res.render('list', {
    title: '老苏列表',
    movies: [{
      title: '群胡子',
      _id: 1,
      doctor: '老苏',
      country: '中国',
      year: 2014,
      poster: 'http://r1.ykimg.com/050C000058CE018AADC0B0058B0B2293',
      language: '英语',
      flash: 'http://player.youku.com/player.php/sid/XMjY0NDQ1NzcwOA==/v.swf',
      summary: '只要不是一线演员演的古装悬疑剧我觉得都是好剧，热血长安，神探狄仁杰，有同感的都点个赞吧,只要不是一线演员演的古装悬疑剧我觉得都是好剧，热血长安，神探狄仁杰，有同感的都点个赞吧'
    }]
  })
})