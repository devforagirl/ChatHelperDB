const mongoose = require('mongoose');

const U2bUserSchema = mongoose.Schema(
  {
    user_name: {
      type: String,
      default: "Emptyuser_name"
    },
    user_email: {
      type: String,
      unique: true,
      require: true,
      default: "Emptyuser_email"
    },
    user_password: {
      type: String,
      default: "Emptyuser_password"
    },
    user_status: {
      type: String,
      require: true,
      default: "active"
    },
    // login 请求时更新
    user_last_login: {
      type: Number,
      default: 1199116800 // 2008-01-01 00:00:00
    },
    createdAt: Number,
    updatedAt: Number,
  },
  {
    // Use Unix timestamps (seconds since Jan 1st, 1970)
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }
  }
)

module.exports = mongoose.model('u2busercoll', U2bUserSchema) // 第一个参数是在数据库中的Collection的名称，collection名称应该为第三个参数，若为缺省，会自动根据参数name的值以复数形式生成collection。