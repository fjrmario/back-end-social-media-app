var express = require('express');
var router = express.Router();
const signController = require("../controllers/sign")

router.route('/signup')
.get(signController.showSignUpPage)
.post(signController.signUp)

router.route('/login')
.get(signController.showSignInPage)
.post(signController.signIn)

module.exports = router;
