const express = require('express');
const { signin, login } = require('../controllers/auth');

const router = express.Router();

router.route('/signin').post(signin);
router.route('/login').post(login);

module.exports = router;
