const mongoose = require('mongoose');

const U2bFavUserSchema = mongoose.Schema(
  {
    viewer_channel_id: {
      type: String,
      require: true,
      default: "EmptyChannelId"
    },
    viewer_current_name: {
      type: String,
      default: "EmptyName"
    },
    viewer_image_url: {
      type: String,
      trim: true,
    },
    createdAt: Number,
    updatedAt: Number,
  },
  {
    // Use Unix timestamps (seconds since Jan 1st, 1970)
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }
  }
)

module.exports = mongoose.model('u2bviewercoll', U2bFavUserSchema) // 第一个参数是在数据库中的Collection的名称，collection名称应该为第三个参数，若为缺省，会自动根据参数name的值以复数形式生成collection。