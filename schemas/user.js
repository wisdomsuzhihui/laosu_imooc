/**
 * 模式 Schema
 */
var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')
var SALT_WORK_FACTOR = 10 // 加盐强度

var UserSchema = new mongoose.Schema({
  name: {
    unique: true,
    type: String
  },
  password: String,
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
UserSchema.pre('save', function (next) {
  var user = this

  if (this.isNew) {
    this.meta.createAt = this.meta.updataAt = Date.now()
  } else {
    this.meta.updataAt = Date.now()
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err)
    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) return next(err)
      user.password = hash
      next()
    })
  })
})

// 实例方法对象
UserSchema.methods = {
  comparePassword: function (_password, cb) {
    bcrypt.compare(_password, this.password, function (err, isMatch) {
      if (err) return cb(err)

      cb(null, isMatch)
    })
  }
}

UserSchema.statics = {
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

module.exports = UserSchema