const express = require('express');
const router = express.Router();
const userController = require('../../controllers/users');
const auth = require('../../utils/auth');

router.post('/', userController.createUser);

router.post('/login', auth, userController.loginUser);

router.post('/new-post', auth, userController.createPost);

router.post('/login/get-posts', auth, userController.getAuthorPosts)


module.exports = router;