const jwt = require('jsonwebtoken')
const U2bUserModel = require('../models/u2bUserModel')
const U2bUserSettingModel = require('../models/u2bUserSettingModel')
const U2bUserSettingAudioModel = require('../models/u2bUserSettingAudioModel')
const U2bViewerModel = require('../models/u2bViewerModel')
const U2bViewerChatModel = require('../models/u2bViewerChatModel')

exports.login_getUserInfo = async (req, res) => {
  if (req.body) {
    const user_info = {
      user_name: req.body.name,
      user_email: req.body.email,
      user_password: req.body.password
    }

    // 通过检查email判断用户是否存在
    U2bUserModel.findOne({ user_email: user_info.user_email, user_password: user_info.user_password }, (err, userRes) => {
      if (err) {
        console.log(err)
      } {
        if (userRes) {
          // email已存在，获取并发送此用户资料
          const token = jwt.sign({ user_info }, 'the_secret_key')
          // In a production app, you'll want the secret key to be an environment variable

          res.json({
            token,
            email: userRes.user_email,
            name: userRes.user_name,
            status: userRes.user_status
          })
        } else {
          // email不存在，"Bad Request"
          res.sendStatus(400)
        }
      }
    })
  }
}

exports.register_addUser = async (req, res) => {
  if (req.body) {
    let token_register
    let user_res
    let setting_res
    const user_info = {
      user_name: req.body.name,
      user_email: req.body.email,
      user_password: req.body.password
    }

    // 通过检查Email判断用户是否存在
    U2bUserModel.findOne({ user_email: user_info.user_email }, async (err, user) => {
      if (err) {
        console.log(err)
      } {
        if (user) {
          // Email已存在，"Bad Request"
          res.sendStatus(400)
        } else {
          // Email不存在
          // step1: 创建一个新用户
          await U2bUserModel.insertMany([user_info], (err, userRes) => {
            if (err) {
              console.log(err)
              res.status(500).send(err)
            } else {
              token_register = jwt.sign({ user_info }, 'the_secret_key')
              user_res = userRes
              // In a production app, you'll want the secret key to be an environment variable
            }
          })

          // step2: 创建一个新用户的默认设置
          const user_default_setting = {
            user_email: req.body.email
            // 其余的用默认值
          }

          await U2bUserSettingModel.insertMany([user_default_setting], (err, settingRes) => {
            if (err) {
              console.log(err)
              res.status(500).send(err)
            } else {
              // step3: 返回结果
              if (user_res[0]) {
                res.json({
                  token: token_register,
                  email: user_res[0].user_email,
                  name: user_res[0].user_name,
                  status: user_res[0].user_status
                })
              } else {
                res.status(500).send(err)
              }
            }
          })
        }
      }
    })
  }
}

exports.dashboard_getUserSetting = (req, res) => {
  jwt.verify(req.token, 'the_secret_key', async (err, tokenRes) => {
    if (err) {
      res.sendStatus(401)
    } else {
      const result2 = await U2bUserSettingModel.find({ user_email: tokenRes.user_info.user_email })

      const result3 = await U2bViewerModel.find({ viewer_channel_id: { "$in": result2[0].viewer_ids } })

      const result4 = await U2bUserSettingAudioModel.find({ audio_id: { "$in": result2[0].audio_ids } })

      const dataToSend = {
        'usersetting': result2[0],
        'viewers': result3,
        'audios': result4
      }

      res.json(dataToSend)
    }
  })
}

exports.saveUserSettings = (req, res) => {
  console.log('req.body2->', req.body)
  console.log('req.token2->', req.token)
  // req.body-> { x: 5, y: 6, flagScrollToBottom: true }

  jwt.verify(req.token, 'the_secret_key', async (err, tokenRes) => {
    if (err) {
      res.sendStatus(401)
    } else {
      const filter = { user_email: tokenRes.user_info.user_email }
      const opts = { new: true }
      const update = {
        "$set": {
          'user_settings': JSON.stringify(req.body)
        }
      }

      U2bUserSettingModel.findOneAndUpdate(filter, update, opts, (err, result5) => {
        if (err) {
          console.log('err->', err)
          res.status(500).send(err)
        } else {
          console.log('result5->', result5)
          res.status(200).send(result5.user_settings)
        }
      })
    }
  })
}
