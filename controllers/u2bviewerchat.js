const U2bViewerModel = require('../models/u2bViewerModel')
const U2bViewerChatModel = require('../models/u2bViewerChatModel')

exports.addOneChat = async (req, res) => {

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

exports.deleteviewerchat = async (req, res) => {
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