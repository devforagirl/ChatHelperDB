const express = require('express')
const router = express.Router()
const U2bUserController = require('../controllers/u2buser')
const U2bAudioController = require('../controllers/u2baudio')
const U2bViewerController = require('../controllers/u2bviewer')
const U2bViewerChatController = require('../controllers/u2bviewerchat')

const chatRouter = express.Router()

router.use('/api', chatRouter)

//设置跨域访问
chatRouter.use('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  next()
})

// <----------- U2bChatPWA API----------->
// 测试地址：http://127.0.0.1:3002/api/u2bviewers
chatRouter.get('/u2bviewers', U2bViewerController.getAllFavUsersInfo)

chatRouter.post('/u2bupdateviewer', U2bViewerController.updateOneViewer)

chatRouter.delete('/u2bviewers', U2bViewerController.deleteviewers)

chatRouter.post('/u2bviewer', U2bViewerController.addOneViewer)

chatRouter.get('/u2bviewer', verifyToken, U2bViewerController.getChatsByViewerId)

chatRouter.post('/u2baudio', U2bAudioController.addOneAudio)

chatRouter.post('/u2bviewerchat', U2bViewerChatController.addOneChat)

chatRouter.delete('/u2bviewerchat', U2bViewerChatController.deleteviewerchat)

// <----------- U2bChatAuthentication API ----------->
// 测试地址：http://127.0.0.1:3002/api/dashboard
chatRouter.post('/register', U2bUserController.register_addUser)
chatRouter.post('/login', U2bUserController.login_getUserInfo)
chatRouter.get('/dashboard', verifyToken, U2bUserController.dashboard_getUserSetting)
chatRouter.post('/settings', verifyToken, U2bUserController.saveUserSettings)

// MIDDLEWARE
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