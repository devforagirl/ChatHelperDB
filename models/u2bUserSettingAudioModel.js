const mongoose = require('mongoose');

const U2bSettingAudioSchema = mongoose.Schema(
  {
    audio_id: {
      type: Number,
      require: true
    },
    audio_data: {
      type: String,
      require: true,
      default: "Emptydata"
    },
    audio_contributor_mail: {
      type: String,
      default: "Emptycontributor_mail"
    },
    createdAt: Number,
    // 用updatedAt倒序排列
    updatedAt: Number,
  },
  {
    // Use Unix timestamps (seconds since Jan 1st, 1970)
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }
  }
)

module.exports = mongoose.model('u2bsettingaudiocoll', U2bSettingAudioSchema) // 第一个参数是在数据库中的Collection的名称，collection名称应该为第三个参数，若为缺省，会自动根据参数name的值以复数形式生成collection。