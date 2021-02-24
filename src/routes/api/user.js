const express = require('express');
const router = express.Router();
const userController = require('../../controllers/users');
const auth = require('../../utils/auth');

router.post('/', userController.createUser);

router.post('/me', auth, userController.loginUser);


module.exports = router;