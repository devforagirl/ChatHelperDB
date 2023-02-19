const express = require('express');
const router = express.Router();
const appleController = require('../controllers/appleController');

router.get('/', appleController.getApples);

module.exports = router;
