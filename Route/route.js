const express = require('express');
const { addRole, Register, login, getUsersList, getUser } = require('../Controller/userController');
const { auth, isAdmin, isUser } = require('../middleware/auth');
const router = express.Router();

router.post('/role', addRole)
router.post('/register', Register);
router.post('/login', login);
router.get('/user', auth, isAdmin, getUsersList);
router.get('/user/:id', auth, isUser, getUser);

module.exports = router;