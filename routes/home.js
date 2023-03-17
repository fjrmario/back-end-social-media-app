var express = require('express');
var router = express.Router();
const homeController = require("../controllers/home")
const signController = require("../controllers/sign")
const { isAuth } = require("../controllers/sign")


// show profile
router.route('/:userid')
.get(isAuth, homeController.showProfile)
.post(isAuth, homeController.createNewPost)

router.route(`/:userid/timeline`)
.get(homeController.showTimeline)

//activity with a post
router.delete(`/:userid/posts/:postid`, homeController.deletePost )
router.put(`/:userid/posts/:postid`, isAuth, homeController.likePost)


// edit profile
router.route('/:userid/edit')
.get( isAuth, homeController.showEditPage )
.put( homeController.updateProfile )

// deactivate account
router.route('/:userid/delete')
.get( isAuth, homeController.showDeletePage )
.delete( isAuth, homeController.deleteProfile )

//commenting
router.route('/:userid/comment/:postid')
.post( isAuth, homeController.createAComment )
.delete( isAuth, homeController.deleteComment )
.put( isAuth, homeController.likeComment )

//searching for friends
router.route('/:userid/search')
.get( homeController.searchFriends )
.put( homeController.follow)

router.route(`/:userid/search/:postid`)
.post(isAuth, homeController.commentOnSearch)

router.route('/:userid/likes')
// .get(homeController.showLikes)

// Timeline comments
router.route(`/:userid/timeline/:postid`)
.post(isAuth, homeController.createTimelineComment)
.delete(isAuth, homeController.deleteTimelineComment)


module.exports = router;
