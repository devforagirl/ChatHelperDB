const express = require('express')
const router = express.Router()
const apiRouter = express.Router()
const U2bUserController = require('../controllers/u2buser')
const U2bAudioController = require('../controllers/u2baudio')
const U2bViewerController = require('../controllers/u2bviewer')
const U2bViewerChatController = require('../controllers/u2bviewerchat')

router.use('/api', apiRouter)

// <----------- U2bChatPWA API----------->
// 测试地址：http://127.0.0.1:3002/api/u2bviewers
apiRouter.get('/u2bviewers', U2bViewerController.getAllFavUsersInfo)
apiRouter.post('/u2bupdateviewer', U2bViewerController.updateOneViewer)
apiRouter.delete('/u2bviewers', U2bViewerController.deleteviewers)
apiRouter.post('/u2bviewer', U2bViewerController.addOneViewer)
apiRouter.get('/u2bviewer', verifyToken, U2bViewerController.getChatsByViewerId)
apiRouter.post('/u2baudio', U2bAudioController.addOneAudio)
apiRouter.post('/u2bviewerchat', U2bViewerChatController.addOneChat)
apiRouter.delete('/u2bviewerchat', U2bViewerChatController.deleteviewerchat)
apiRouter.post('/register', U2bUserController.register_addUser)
apiRouter.post('/login', U2bUserController.login_getUserInfo)
apiRouter.get('/dashboard', verifyToken, U2bUserController.dashboard_getUserSetting)
apiRouter.post('/settings', verifyToken, U2bUserController.saveUserSettings)

// MIDDLEWARE 让gpt稍后再optimize一次
function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization']

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1]
    req.token = bearerToken
    next()
  } else {
    res.sendStatus(401)
  }
}

// 其他情形返回404
router.use((req, res, next) => {
  res.send('404. URL地址有误')
})

module.exports = router