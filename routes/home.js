var express = require('express');
var router = express.Router();
const homeController = require("../controllers/home")
const signController = require("../controllers/sign")


// update user profile
router.route('/:userid')
.put()

router.get('/:userid', homeController.showProfile);

router.put('/:userid/edit', homeController.updateProfile);
router.get('/:userid/edit', signController.isAuth, homeController.showEditPage)

router.get('/:userid/delete', signController.isAuth, homeController.showDeletePage)
router.delete('/:userid/delete', signController.isAuth, homeController.deleteProfile)

router.post('/:userid', signController.isAuth, homeController.createNewPost);

router.post('/:userid/comment/:postid', signController.isAuth, homeController.createAComment)
router.delete(`/:userid/posts/:postid`, homeController.deletePost )

router.delete(`/:userid/comment/:postid`, signController.isAuth, homeController.deleteComment )


router.get('/:userid/search', homeController.searchFriends )

module.exports = router;
