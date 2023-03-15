var express = require('express');
var router = express.Router();
const homeController = require("../controllers/home")
const signController = require("../controllers/sign")


// show profile
router.route('/:userid')
.get(homeController.showProfile)
.post(signController.isAuth, homeController.createNewPost)

//activity with a post
router.delete(`/:userid/posts/:postid`, homeController.deletePost )
router.put(`/:userid/posts/:postid`, signController.isAuth, homeController.likePost)


// edit profile
router.route('/:userid/edit')
.get(signController.isAuth, homeController.showEditPage)
.put(homeController.updateProfile)

// deactivate account
router.route('/:userid/delete')
.get(signController.isAuth, homeController.showDeletePage)
.delete(signController.isAuth, homeController.deleteProfile)

//commenting
router.route('/:userid/comment/:postid')
.post(signController.isAuth, homeController.createAComment)
.delete(signController.isAuth, homeController.deleteComment)
.put(signController.isAuth, homeController.likeComment)



//searching for friends
router.get('/:userid/search', homeController.searchFriends )


module.exports = router;
