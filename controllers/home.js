const Activity = require('../models/activity');
const User = require("../models/users");
const { post } = require("../routes");

const showProfile = async (req, res) => {
    const userid = req.params.userid
    try{
        const user = await User.findOne({ userid }).populate('posts', 'post').populate({path:'posts', model: Activity, options: {sort: { postTimestamp: -1}}});
        res.render('content/index', { posts: user.posts, user: user, getTimeAgo: getTimeAgo  });
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


function getTimeAgo(postTimestamp){
    const now = Date.now();
    const timeDiff = now - postTimestamp;

    // Time is in milliSeconds
    const MINS = 60000
    const HOURS = 3600000
    const DAYS = 86400000
    const WEEKS = 604800000
    const YEARS = 2592000000
    const MULTIPLEYEARS = 31536000000

    if(timeDiff < MINS){
        return "just now"
    }
    else if (timeDiff < HOURS) {
        minsAgo = Math.floor(timeDiff / MINS);
        return `${minsAgo} minute${minsAgo > 1 ? 's' : ''} ago`;
    }
    else if(timeDiff < DAYS) {
        const hoursAgo = Math.floor(timeDiff / HOURS);
        return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
    }
    else if (timeDiff < WEEKS) {
        const daysAgo = Math.floor(timeDiff / DAYS);
    }
    else if (timeDiff < YEARS) {
        const weeksAgo = Math.floor(timeDiff / WEEKS);
        return `${weeksAgo} week${weeksAgo > 1 ? 's' : ''} ago`;
    }
    else if (timeDiff < MULTIPLEYEARS) {
        const monthsAgo = Math.floor(timeDiff / YEARS);
        return `${monthsAgo} month${monthsAgo > 1 ? 's' : ''} ago`;
    }
    else {
        const yearsAgo = Math.floor(timeDiff / MULTIPLEYEARS);
        return `${yearsAgo} year${yearsAgo > 1 ? 's' : ''} ago`;
    }
}

module.exports = {
    showProfile,
    createNewPost,
    getTimeAgo
}

