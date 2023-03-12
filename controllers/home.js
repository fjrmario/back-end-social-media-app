const User = require("../models/users");
const Activity = require('../models/activity');
const { post } = require("../routes");

const showProfile = async (req, res) => {
    const userid = req.params.userid
    try{
        const user = await User.findOne({ userid }).populate('posts', 'post').populate({path:'posts', model: Activity, options: {sort: { postTimestamp: -1}}});
        res.render('content/index', { posts: user.posts, user: user  });
    }

    catch(error){
        console.log(error)
    }
}

const createNewPost = async (req, res) => {
    const { post } = req.body;
    const { userid } = req.params;
    
    try {
        const user = await User.findOne({userid});

        const activity = new Activity({user: user._id, post})

        await activity.save();
        user.posts.push(activity._id);
        await user.save();

        res.redirect(`/home/${userid}`);
    }

    catch (error){
        console.log(error)
    }
}

module.exports = {
    showProfile,
    createNewPost
}

