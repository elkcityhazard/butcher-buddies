const express = require('express');
const router = express.Router();
const frontController = require('../controllers/front');

router.get('/', frontController.loadHome);



module.exports = router;