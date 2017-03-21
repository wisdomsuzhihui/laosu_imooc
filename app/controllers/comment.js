var Comment = require('../models/comment')


// admin post movie
exports.save = function (req, res) {
  var _comment = req.body.user
  var movieId = _comment.movie
  var comment = new Comment(_comment)

  comment.save(function (err, comment) {
    if (err) {
      console.log(err)
    }
    res.redirect('/movie/' + movieId);
  })
}