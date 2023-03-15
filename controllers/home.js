const Activity = require('../models/activity');
const User = require("../models/users");
const bcrypt = require('bcrypt');



const showProfile = async (req, res) => {
    const { userid } = req.params
    noSession = req.session.userId

    if(!noSession){
        res.redirect('/home/:userid/search')
    }
    try{
        const user = await User.findOne({ userid })
        .populate({
            path: 'posts',
            model: Activity.Post,
            select: 'post postTimestamp comments likes',
            options: {sort: {postTimestamp: -1, _id: -1}
        },
        populate: {
            path:'comments',
            model: Activity.Comment,
            select:'user content contentTimeStamp likes',
            populate: {
                path: 'user',
                model: User,
                select: 'userid'
            }
        }})

        let comments = [];
        if(user.posts[0]){
            comments = user.posts[0].comments
        }

        let likes = [];
        if(user.posts[0]){
            likes = user.posts[0].likes
        }

        res.render('content/index', 
        {
            bio: user.bio,
            posts: user.posts, 
            likes: likes,
            user: user, 
            comments: comments,
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
    const { userid, email, password, bio } = req.body;
  
    const updateFields = {};
   
    if (userid) updateFields.userid = userid;
    if (email) updateFields.email = email;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/
    
    if(!password){
        const user = await User.findOne({ userid: currentUser });
        updateFields.password = user.password;
    } else if (passwordRegex.test(password)) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        updateFields.password = hashedPassword;
    } else{
        return res.status(400).send('Password requires to be a minimum of 8 characters, an uppercase and a special character.')
    }

    if(!bio) {
        updateFields.bio = bio
    } else {
        updateFields.bio = bio
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
    const nowUser = req.user._id
    const { commentNow } = req.body;

    try{
        const post = await Activity.Post.findById(postid);
        const comment = new Activity.Comment(
            {
                user: nowUser, 
                content: commentNow
            }
        );
        
        await comment.save();
        post.comments.push(comment._id);
        await post.save();

        const updatedPost = await Activity.Post.findById(postid).populate({
            path: 'comments',
            model: Activity.Comment,
            select: 'content contentTimestamp'
        })

        res.redirect(`/home/${userid}`);


    }

    catch (error) {
        console.log(error)
    }
}


const deletePost = async (req, res) => {
    const { userid, postid } = req.params;

    try{
        const activity = await Activity.Post.findOne({_id:postid});
        const postOwnerId = activity.user;
        const user = await User.findOne(postOwnerId);
        const index = user.posts.indexOf(postid)
        console.log(activity.comments)
        if(index > -1){
            user.posts.splice(index,1)
            await user.save();
        }

        await Activity.Comment.deleteMany({_id:activity.comments})

        await Activity.Post.deleteOne({ _id: postid })
        
        res.redirect(`/home/${userid}`);
    }
    
    catch (error){
        console.log(error)
    }
};

const likePost = async (req, res) => {
    const nowUser = req.user.userid
    const {postid} = req.params
    try{
        const loggedInUser = await User.findOne({userid: nowUser});
        const likedPost = await Activity.Post.findOne({_id: postid});

        
        if(!likedPost.likes.includes(loggedInUser.id)){
                await Activity.Post.updateOne({_id: postid}, { $push: {likes: loggedInUser.id}});
                res.redirect(`/home/${nowUser}`)

        } else {
            await Activity.Post.updateOne({_id: postid}, {$pull: {likes: loggedInUser.id}});
            res.redirect(`/home/${nowUser}`)

        }

    }
    catch (error){
        res.send(error)
    }
}

const likeComment = async (req, res) => {
    const user = req.user.userid
    const {postid} = req.params
    console.log(postid);

    try{
        const loggedInUser = await User.findOne({userid: user})
        const likedComment = await Activity.Comment.findOne({_id: postid})

        if(!likedComment.likes.includes(loggedInUser.id)){
            await Activity.Comment.updateOne({_id: postid}, { $push: {likes: loggedInUser.id}}, {multi: false});
            res.redirect(`/home/${user}`)

        } 
        else {
            await Activity.Comment.updateOne({_id: postid}, {$pull: {likes: loggedInUser.id}});
            res.redirect(`/home/${user}`)

        }
    }
    catch(error){
        res.send(error)
    }
}
const deleteComment = async (req, res) => {
    const { userid, postid } = req.params;

    try{
        const comment = await Activity.Comment.findOne({_id:postid});
        const post = await Activity.Post.findOne({ comments: comment._id })
        const commentIndex = post.comments.indexOf(postid)
        console.log(commentIndex);
        post.comments.splice(commentIndex, 1)
        await post.save();

        await Activity.Comment.findOneAndDelete({_id:postid});

        res.redirect(`/home/${userid}`)
    }
    
    catch (error){
        console.log(error)
    }
}

const searchFriends = async (req, res) => {
    const { userid } = req.query;
    const loggedInUsers = req.params
    console.log(loggedInUsers);

    try{
        const loggedInUser = await User.findOne(loggedInUsers)
        console.log(loggedInUser);
        const result = await User.findOne({userid}).populate('posts')
        res.render(`content/search`, {
            result,
            back: req.params.userid,
            getTimeAgo: getTimeAgo
            
        })
    }
    catch(error){
        res.send(error)
    }
};

const follow = async (req, res) => {
    const user = req.query.userid
    res.send(`${user}`)
    console.log(user)
    // const {postid} = req.params
    // console.log(postid);

    // try{
    //     const loggedInUser = await User.findOne({userid: user})
    //     const likedComment = await Activity.Comment.findOne({_id: postid})

    //     if(!likedComment.likes.includes(loggedInUser.id)){
    //         await Activity.Comment.updateOne({_id: postid}, { $push: {likes: loggedInUser.id}}, {multi: false});
    //         res.redirect(`/home/${user}`)

    //     } 
    //     else {
    //         await Activity.Comment.updateOne({_id: postid}, {$pull: {likes: loggedInUser.id}});
    //         res.redirect(`/home/${user}`)

    //     }
    // }
    // catch(error){
    //     res.send(error)
    // }
}


function getTimeAgo(postTimestamp){
    const now = Date.now();
    const timeDiff = now - new Date(postTimestamp).getTime();

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
    deleteComment,
    deletePost,
    likePost,
    searchFriends,
    likeComment,
    follow,
    getTimeAgo
}

