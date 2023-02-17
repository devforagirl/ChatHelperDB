const jwt = require('jsonwebtoken')
const U2bViewerModel = require('../models/u2bViewerModel')
const U2bViewerChatModel = require('../models/u2bViewerChatModel')
const U2bUserSettingModel = require('../models/u2bUserSettingModel')

// 获取所有fav users的info, 注意不含其留言
exports.getAllFavUsersInfo = async (req, res) => {
  const result4 = await U2bViewerModel.find({}).sort({ updatedAt: -1 })
  res.status(200).send(result4)
}

// 获取某一个 viewer 的全部留言
exports.getChatsByViewerId = async (req, res) => {
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

// 新增一位viewer
exports.addOneViewer = async (req, res) => {
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

// 更新一位viewer
exports.updateOneViewer = async (req, res) => {
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

// 删除一位或多位viewer
exports.deleteviewers = async (req, res) => {
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

    // 联表连查(聚合查询)新写法：全部用户列表带每人最多2条的留言
    // const result2 = await U2bViewerModel.aggregate([{
    //   '$lookup': {
    //     'from': 'u2bchatscollections',
    //     'let': {
    //       'userId': '$user_channel_id'
    //     },
    //     'pipeline': [
    //       {
    //         '$match':
    //         {
    //           '$expr':
    //             { '$eq': ['$user_channel_id', '$$userId'] }
    //         }
    //       },
    //       {
    //         '$sort': { 'createdAt': -1 }
    //       },
    //       {
    //         '$limit': 2
    //       },
    //     ],
    //     'as': 'userChatsData'
    //   }
    // }
    // ])

    // 联表连查(聚合查询)老写法
    // const result2 = await U2bViewerModel.aggregate(
    //   [
    //     {
    //       $match: {
    //         user_channel_id: req.query.user_channel_id
    //       }
    //     },
    //     {
    //       $lookup: {
    //         from: 'u2bchatscollections', // Specifies the collection in the same database to perform the join with. 单词尾可能自动加s，请注意。
    //         localField: 'user_channel_id',
    //         foreignField: 'user_channel_id',
    //         as: 'userChatsData'
    //       }
    //     }
    //   ]
    // )