const jwt = require('jsonwebtoken')
const U2bUserModel = require('../models/u2bUserModel')
const U2bUserSettingModel = require('../models/u2bUserSettingModel')
const U2bUserSettingAudioModel = require('../models/u2bUserSettingAudioModel')
const U2bViewerModel = require('../models/u2bViewerModel')
const U2bViewerChatModel = require('../models/u2bViewerChatModel')

const getAdoIds = async (req, res) => {
  U2bUserSettingModel.find({ user_email: '10@mail.com' })
.then((result) => {
  let audioIds = []
  console.log('audioIds 1', result)
  result.forEach((doc) => {
    console.log('audioIds 2', doc)
    for (let audio of doc.audio_ids) {
      console.log('audioIds 3', audio)
      audioIds.push(audio.adoId)
    }
  })
  console.log('audioIds 4', audioIds)
})
.catch((err) => {
  console.log('err', err)
})
}

// 获取所有fav users的info, 注意不含其留言
const getAllFavUsersInfo = async (req, res) => {
  try {
    const result = await U2bViewerModel.find({}).sort({ updatedAt: -1 })
    res.status(200).send(result)
  } catch (error) {
    console.log(error)
    res.status(500).send('Internal Server Error')
  }
}

// 删除一位或多位viewer
const deleteviewers = async (req, res) => {
  const opts = { new: true }
  const filter = { 'user_email': req.body.user_email }
  const to_delete_ids = req.body.viewer_channel_id
  const update = {
    '$pull': {
      'viewer_ids': { "$in": to_delete_ids }
    }
  }

  U2bUserSettingModel.findOneAndUpdate(filter, update, opts, (err, delRes) => {
    if (err) {
      console.log(err)
      res.status(500).send({
        message: "删除一位或多位观众 Failed."
      })
    } else {
      console.log(delRes)
      res.status(200).send({
        message: "删除一位或多位观众 Successfully.",
        delRes: delRes
      })
    }
  })
}

// 更新一位viewer
const updateOneViewer = async (req, res) => {
  const opts = { new: true }
  const target = "user_used_names"
  const filter = { "user_channel_id": req.body.user_channel_id }

  const distintedNames = await U2bViewerModel.distinct(target, filter)

  if (!distintedNames.includes(req.body.user_current_name)) distintedNames.push(req.body.user_current_name)

  const update = {
    "$set": {
      "user_level": req.body.user_level,
      "user_note": req.body.user_note,
      "user_status": req.body.user_status,
      "user_current_name": req.body.user_current_name,
      "user_image_url": req.body.user_image_url,
      "user_used_names": distintedNames
      // "user_last_seen" 不在这里更新
    }
  }

  U2bViewerModel.findOneAndUpdate(filter, update, opts, (function (err, user) {
    if (err) {
      console.log(err)
      res.status(500).send(err)
    } else {
      res.status(200).send(user)
    }
  }))
}

// 新增一位viewer
const addOneViewer = async (req, res) => {
  const docOneU2bFavUser = {
    viewer_channel_id: req.body.viewer_channel_id,
    viewer_image_url: req.body.viewer_image_url,
    viewer_current_name: req.body.viewer_current_name
  }

  // Mongoose里没有insertOne,所以用insertMany
  const result3 = await U2bViewerModel.insertMany([docOneU2bFavUser])

  const response = {
    msg: 'A NEW FAV USER DOC HAS BEEN CREATED',
    viewer_channel_id: result3[0].viewer_channel_id,
    viewer_image_url: result3[0].viewer_image_url,
    viewer_current_name: result3[0].viewer_current_name,
    createdAt: result3[0].createdAt,
    updatedAt: result3[0].updatedAt
  }

  res.status(200).send(response)
}

// 获取某一个 viewer 的全部留言
const getChatsByViewerId = async (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, tokenRes) => {
    if (err) {
      res.sendStatus(401)
    } else {
      // console.log('req3->', req)
      // 查看此 viewer是否在u2bviewercoll集合中
      const result2 = await U2bViewerChatModel.find(
        {
          viewer_channel_id: req.query.viewer_channel_id,
          recipient_email: tokenRes.user_info.user_email
        }
      ).sort({ createdAt: -1 })

      console.log('viewer_channel_id->', req.query.viewer_channel_id)
      console.log('user_email->', tokenRes.user_info.user_email)
      console.log('result2->', result2)

      const response = {
        chatsCount: result2.length,
        userChatsData: result2
      }

      res.status(200).send(response)
    }
  })
}

const register_addUser = async (req, res) => {
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
              token_register = jwt.sign({ user_info }, process.env.JWT_SECRET)
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

const login_getUserInfo = async (req, res) => {
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
          const token = jwt.sign({ user_info }, process.env.JWT_SECRET)
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

const dashboard_getUserSetting = (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, tokenRes) => {
    if (err) {
      res.sendStatus(401)
    } else {
      const result2 = await U2bUserSettingModel.find({ user_email: tokenRes.user_info.user_email })

      const result3 = await U2bViewerModel.find({ viewer_channel_id: { "$in": result2[0].viewer_ids } })

      const result4 = await U2bUserSettingAudioModel.find({ audio_id: { "$in": result2[0].audio_ids } })

      const result5 = await U2bUserSettingModel.find({ user_email: tokenRes.user_info.user_email })

      const dataToSend = {
        'usersetting': result2[0],
        'viewers': result3,
        'audios': result4,
        'audiosv2': result5.audio_ids
      }

      res.json(dataToSend)
    }
  })
}

const saveUserSettings = (req, res) => {
  console.log('req.body2->', req.body)
  console.log('req.token2->', req.token)
  // req.body-> { x: 5, y: 6, flagScrollToBottom: true }

  jwt.verify(req.token, process.env.JWT_SECRET, async (err, tokenRes) => {
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

const addOneAudio = async (req, res) => {
  U2bUserSettingAudioModel.find({}, (err, result1) => {
    if (err) {
      console.log(err)
    } else {
      const docOneAudio = {
        audio_id: result1.length + 1,
        audio_contributor_mail: req.body.audio_contributor_mail,
        audio_data: req.body.audio_data
      }

      U2bUserSettingAudioModel.insertMany([docOneAudio], (err, result2) => {
        if (err) {
          console.log(err)
          res.status(500).send(err)
        } else {
          const response = {
            'audio_id': result2[0].audio_id,
            'audio_contributor_mail': result2[0].audio_contributor_mail
          }
          res.status(200).send(response)
        }
      })
    }
  })
}

const addOneChat = async (req, res) => {

  try {
    // add一条新留言。Mongoose里没有insertOne,所以用insertMany
    const docOneU2bChat = {
      viewer_channel_id: req.body.viewer_channel_id,
      viewer_current_name: req.body.viewer_current_name,
      recipient_email: req.body.recipient_email,
      messageEx: req.body.messageEx
    }

    // const result5 = await U2bViewerChatModel.insertMany([docOneU2bChat])
    U2bViewerChatModel.insertMany([docOneU2bChat], (async function (err, chat) {
      if (err) {
        console.log(err);
        res.status(500).send({
          message: "U2bChat Inserted Failed."
        })
      } else {
        // // 更新留言者的user_last_seen
        // const filter = { user_channel_id: req.body.user_channel_id }
        // const update = { user_last_seen: chat[0].createdAt }
        // const opts = { new: true }

        // const result8 = await U2bViewerModel.findOneAndUpdate(filter, update, opts)

        res.status(200).send({
          message: "U2bChat Inserted Successfully.",
          chat: chat
          // result8: result8
        })
      }
    }))
  } catch (error) {
    console.log(error)
    res.json({ message: error })
  }
}

const deleteviewerchat = async (req, res) => {
  const delete_ids = req.body.viewer_channel_id
  const filter = {
    'viewer_channel_id': { "$in": delete_ids },
    'recipient_email': req.body.recipient_email
  }
  const opt = { w: "majority" }

  U2bViewerChatModel.deleteMany(filter, opt, ((err, result) => {
    if (err) {
      console.log(err)
      res.status(500).send(err)
    } else {
      console.log('result ->', result)
      const response = {
        'operation_status_code': result.ok,
        'num_docs_matched': result.n,
        'num_docs_deleted': result.deletedCount
      }
      res.status(200).send(response)
    }
  })
  )
}

module.exports = {
  getAdoIds,
  getAllFavUsersInfo,
  deleteviewers,
  updateOneViewer,
  addOneViewer,
  getChatsByViewerId,
  register_addUser,
  login_getUserInfo,
  dashboard_getUserSetting,
  saveUserSettings,
  addOneAudio,
  addOneChat,
  deleteviewerchat
};
