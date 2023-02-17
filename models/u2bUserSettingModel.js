const mongoose = require('mongoose');

const U2bUserSettingSchema = mongoose.Schema(
  {
    user_email: {
      type: String,
      default: "Emptyuser_email"
    },
    id: {
      type: String,
      default: "Emptyid"
    },
    title: {
      type: String,
      default: "Emptytitle"
    },
    time: {
      type: String,
      default: "Emptytime"
    },
    date: {
      type: String,
      default: "Emptydate"
    },
    audio_ids: {
      type: [String],
      default: ['1', '2', '3']
    },
    viewer_ids: { // user_channel_id
      type: [String],
      default: ['UCgMiVaSvG5ysiypOfmqjnx4', 'UCgMiVaSvG5ysiypOfmqjnx5', 'UCgMiVaSvG5ysiypOfmqjnx6']
    },
    user_settings: {
      type: String,
      default: '{"x":5,"y":6}'
    },
    // viewer的曾用名？user_status？user_level?user_note?
    createdAt: Number,
    updatedAt: Number,
  },
  {
    // Use Unix timestamps (seconds since Jan 1st, 1970)
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }
  }
)

module.exports = mongoose.model('u2busersettingcoll', U2bUserSettingSchema) // 第一个参数是在数据库中的Collection的名称，collection名称应该为第三个参数，若为缺省，会自动根据参数name的值以复数形式生成collection。