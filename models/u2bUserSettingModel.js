const mongoose = require('mongoose');

const U2bUserSettingSchema = mongoose.Schema(
  {
    user_email: {
      type: String,
      default: "Emptyuser_email"
    },
    // audio_ids: {	
    //   type: [String],	
    //   default: ['1', '2', '3']	
    // },
    audio_ids: [{
      audio_id: Number,
      audio_note: String
    }],
    viewer_ids: { // user_channel_id
      type: [String],
      default: ['UCgMiVaSvG5ysiypOfmqjnx4', 'UCgMiVaSvG5ysiypOfmqjnx5', 'UCgMiVaSvG5ysiypOfmqjnx6']
    },
    user_settings: {
      type: String,
      default: '{"x":5,"y":6,"flagScrollToBottom":true,"flagTimeDisplayFormat":true,"flagAvatar":false,"numStoredChats":"20","chatsSpeed":2}'
    },
    numStoredChats: { // 改前端默认的类型字符串"20"为数字20
      type: Number,
      default: 20
    },
    chatsSpeed: { // 这项前端默认的类型已经是数字型了
      type: Number,
      default: 2
    },
    flagAvatar: {
      type: Boolean,
      default: false
    },
    flagTimeDisplayFormat: {
      type: Boolean,
      default: true
    },
    flagScrollToBottom: {
      type: Boolean,
      default: true
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
