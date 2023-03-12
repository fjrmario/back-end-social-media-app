var express = require('express');
var router = express.Router();
const usersController = require("../controllers/users")

router.route('/signup')
.get(usersController.showSignUpPage)
.post(usersController.signUp)

router.route('/login')
.get(usersController.showlogInPage)
.post(usersController.logIn)

module.exports = router;
