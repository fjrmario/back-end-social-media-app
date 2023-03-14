const Activity = require('../models/activity');
const User = require("../models/users");
const bcrypt = require('bcrypt');



const showProfile = async (req, res) => {
    const { userid } = req.params
    const user = await User.findOne({userid})

    try{
        const user = await User.findOne({ userid })
        .populate({
            path: 'posts',
            model: Activity.Post,
            select: 'post postTimestamp',
            options: {sort: {postTimestamp: -1}
        }})

        res.render('content/index', 
        {
            posts: user.posts, 
            user: user, 
            getTimeAgo: getTimeAgo  
        });
        
    }

    catch(error){
        console.log(error)
    }

}

const showEditPage = async (req, res) => {
    const userid = req.params.userid

    try{
        const user = await User.findOne({userid});
        res.render('content/edit', {user: user})
    }

    catch(error){
        res.send(error)
    }
}

const updateProfile = async (req, res) => {
    const currentUser = req.params.userid;
    const { userid, email, password } = req.body;
  
    const updateFields = {};
    if (userid) updateFields.userid = userid;
    if (email) updateFields.email = email;
    if (password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updateFields.password = hashedPassword;
    }
  
    try {
      const user = await User.findOneAndUpdate({ userid: currentUser }, updateFields, {new: true});
      res.redirect(`/home/${user.userid}`);
      res.render('content/index')

    } 

    catch (error) {
      res.send(error);
    }
};

const showDeletePage = async (req, res) => {
    const { userid } = req.params
    try{
        const user = await User.findOne({userid});
        res.render('users/delete', {user: user})
    }

    catch(error){
        res.send(error)
    }
}

const deleteProfile = async (req, res) => {
    const { userid } = req.params
    console.log({ userid });

    try{
        await User.deleteOne({ userid})
        res.redirect(`/`)
    }
    catch(error){
        res.send(error)
    }
}
  
const createNewPost = async (req, res) => {
    const { post } = req.body;
    const { userid } = req.params;

    try {
        const user = await User.findOne({userid})

        const activity = new Activity.Post(
            {
                user: user._id, 
                post
            }
        );

        await activity.save();
        user.posts.unshift(activity._id);
        await user.save();

        res.redirect(`/home/${userid}`);
    }

    catch (error){
        console.log(error)
    }
}

const createAComment = async (req, res, next) => {

    const { userid, postid } = req.params;
    const { commentNow } = req.body;
    
    try{
        const post = await Activity.Post.findById(postid);

        const comment = new Activity.Comment(
            {
                user: req.user._id, 
                content: commentNow
            }
        );

        await comment.save();
        post.comments.push(comment);
        await post.save();

        const updatedPost = await Activity.Post.findById(postid).populate({
                path: 'comments',
                model: Activity.Comment,
                select: 'content contentTimestamp',
                options: {sort: {postTimestamp: -1}
        }})

        res.render('content/index', 
        {
            comments: updatedPost.comments, 
            user: req.user,
            getTimeAgo: getTimeAgo  
        });

        next();
    }

    catch (error) {
        console.log(error)
    }
}

const renderPostAndComments = async (req, res) =>{
    const { userid } = req.params;

    try{
        const user = await User.findOne({ userid }).populate({
            path: 'posts',
            model: Activity.Post,
            select: 'post postTimestamp likes comments',
            populate: {
                path: 'comments',
                model: Activity.Comment,
                select: 'user content contentTimestamp',
                populate: {
                    path: 'user',
                    model: User,
                    select: 'userid'
                },
                options: { sort: { contentTimestamp: -1}}
            },
            options: { sort: { postTimestamp: -1 }}
        });

        res.render('content/index', {
            posts: user.posts,
            user:req.user,
            getTimeAgo: getTimeAgo
        });
    }

    catch(error){
        console.log(error)
    }
}

const deletePost = async (req, res) => {
    const { userid, postid } = req.params;

    console.log({postid});
    console.log({_id:postid});
    try{
        const activity = await Activity.Post.findOne({_id:postid});
        const postOwnerId = activity.user;
        const user = await User.findOne(postOwnerId);
        const index = user.posts.indexOf(postid)
        if(index > -1){
            user.posts.splice(index,1)
            await user.save();
        }
       
        await Activity.Post.deleteOne(
            {_id:postid}
        );
        
        res.redirect(`/home/${userid}`);
    }
    
    catch (error){
        console.log(error)
    }
};



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
        return `${daysAgo} hour${daysAgo > 1 ? 's' : ''} ago`;

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
    showEditPage,
    updateProfile,
    showDeletePage,
    deleteProfile,
    createNewPost,
    createAComment,
    renderPostAndComments,
    deletePost,
    getTimeAgo
}

