/**
 * 模式 Schema
 */
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var CommentSchema = new Schema({
  movie: {
    type: ObjectId,
    ref: 'Movie'
  },
  from: {
    type: ObjectId,
    ref: 'User'
  },
  to: {
    type: ObjectId,
    ref: 'User'
  },
  content: String,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})
// 方法
CommentSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updataAt = Date.now()
  } else {
    this.meta.updataAt = Date.now()
  }
  next()
})

CommentSchema.statics = {
  // 取出所有数据
  fetch: function (cb) {
    return this
      .find({})
      .sort('meta.updateAt') // 按照更新时间排序
      .exec(cb) // 执行回调
  },
  findById: function (id, cb) { // 查询单条数据
    return this
      .findOne({
        _id: id
      })
      .exec(cb)
  }
}

module.exports = CommentSchema