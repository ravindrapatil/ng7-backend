var express = require('express');
var router = express.Router();
var UserController = require('../controllers/users');
const checkAuth = require('../middlewear/check-auth');

router.post('/register', UserController.create_user);
router.post('/login', UserController.loginUser);
// router.get('/userlist', checkAuth, UserController.getAllUsers);
// router.get('/:userId', checkAuth, UserController.getSingleUser);

router.get('/userlist', UserController.getAllUsers);
router.get('/:userId', UserController.getSingleUser);

router.post('/:userId/profile', UserController.updateProfile);
// router.get('/:userId/profile', UserController.getProfile);

module.exports = router;
