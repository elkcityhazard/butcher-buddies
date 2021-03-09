const express = require('express');
const router = express.Router();
const userController = require('../../controllers/users');
const auth = require('../../utils/auth');
const cors = require('cors');

router.use(cors());

router.post('/', userController.createUser);

router.post('/login', userController.loginUser);

router.post('/post', auth, userController.createPost);

router.patch('/post', auth, userController.updatePost);

router.get('/posts/:postID', auth, userController.getPost);

router.post('/login/get-posts', auth, userController.getAuthorPosts);

router.delete('/post', auth, userController.deleteSinglePost);

router.delete('/post/all', auth, userController.deleteAllPosts);

module.exports = router;