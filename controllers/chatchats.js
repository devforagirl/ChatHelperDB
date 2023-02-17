const ChatChatModel = require('../models/chatChatModel')

exports.postChatchats = async (req, res) => {
  try {
    // Mongoose里没有insertOne,所以用insertMany
    const docOneChatChat = {
      encrypted_id: req.body.videoId,
      time: req.body.chatObj.time,
      text: req.body.chatObj.text,
      key: req.body.chatObj.key
    }

    const feedback = await ChatChatModel.insertMany([docOneChatChat])

    let resMsg = null

    if (feedback) {
      resMsg = {
        message: "Chat Inserted Successfully.",
        textInserted: feedback[0].text
      }
    } else {
      resMsg = {
        message: "Chat Inserted Failed."
      }
    }

    res.send(resMsg)

  } catch (error) {
    console.log(error)
    res.json({ message: error })
  }
}
