const ChatVideoModel = require('../models/chatVideoModel')

exports.getChatVideoByVideoId = async (req, res) => {
  console.log('req.params is: ', req.params)

  // 查看此视频是否在dmvideo集合中存在
  const result1 = await ChatVideoModel.find({ encrypted_id: req.params.videoId }).limit(1)

  if (result1.length !== 0) {
    const result2 = await ChatVideoModel.aggregate(
      [
        {
          $match: {
            encrypted_id: req.params.videoId
          }
        },
        {
          $lookup: {
            from: 'chatchats',
            localField: 'encrypted_id',
            foreignField: 'encrypted_id',
            as: 'chatsData'
          }
        }
      ]
    )

    const response = {
      msg: 'A chatvideo doc has been found',
      vid: result2.encrypted_id,
      chatsCount: result2[0].chatsData.length,
      chatsData: result2[0].chatsData
    }

    res.send(response)
  } else {
    const docOneChatVideo = {
      encrypted_id: req.params.videoId
    }

    // Mongoose里没有insertOne,所以用insertMany
    const result3 = await ChatVideoModel.insertMany([docOneChatVideo])

    const response = {
      msg: 'A new chatvideo doc has been created after nothing found',
      vid: result3.encrypted_id,
      chatsCount: 0,
      chatsData: []
    }

    res.send(response)
  }
}
