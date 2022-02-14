const express = require('express')
const router = express.Router()

const authCtrl = require('../controllers/auth');

router.get('/hello', authCtrl.hello);

module.exports = router;