var express = require('express');
var router = express.Router();
const homeController = require("../controllers/home")
const usersController = require("../controllers/users")




router.get('/:userid', usersController.requireAuthentication, homeController.showProfile);
router.post('/:userid', homeController.createNewPost)

module.exports = router;
