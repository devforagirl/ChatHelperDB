const U2bUserSettingAudioModel = require('../models/u2bUserSettingAudioModel')

exports.addOneAudio = async (req, res) => {
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
