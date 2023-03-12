var express = require('express');
var router = express.Router();
const homeController = require("../controllers/home")




router.get('/:userid', homeController.showProfile);
router.post('/:userid', homeController.createNewPost)

module.exports = router;
