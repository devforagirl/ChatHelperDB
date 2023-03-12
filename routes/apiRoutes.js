const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.get('/u2bviewers', apiController.getAllFavUsersInfo);
router.delete('/u2bviewers', apiController.deleteviewers)
router.post('/u2bupdateviewer', apiController.updateOneViewer)
router.post('/u2bviewer', apiController.addOneViewer)
router.get('/u2bviewer', verifyToken, apiController.getChatsByViewerId)
router.post('/u2baudio', apiController.addOneAudio)
router.post('/u2bviewerchat', apiController.addOneChat)
router.delete('/u2bviewerchat', apiController.deleteviewerchat)
// -------------------------------------------------------
router.post('/register', apiController.register_addUser)
router.post('/login', apiController.login_getUserInfo)
router.get('/dashboard', verifyToken, apiController.dashboard_getUserSetting)
router.post('/settings', verifyToken, apiController.saveUserSettings)
// -------------------------------------------------------
// 修改router.post('/settings', verifyToken, apiController.saveUserSettings)
// router.post('/???', verifyToken, apiController.saveUserSettings)
// -------------------------------------------------------
// test
router.get('/audiotest', apiController.getAdoIds);


async function verifyToken(req, res, next) {
  try {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      req.token = bearerToken;
      next();
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

module.exports = router;
