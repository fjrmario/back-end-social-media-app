

// const User = require("../models/users");


// const showProfilePublicly = async (req, res) => {
//     const profileId = req.params.id

//     const availableProfile = await User.findOne({}).exec()
//     // try{
//     //     const profile = await User.findById(profileId);

//     //     if(!profile){
//     //         res.status(404).send('Profile not found');
//     //     } else {
//     //         res.render('content/profiles', { profile });
//     //     }
//     // }

//     // catch (err) {
//     //     console.log('Error fetching profile: ', err);
//     //     res.status(500).send('Internal server error')
//     // }
// }

// function ensureAuthenticated (req, res, next) {
//     if (req.isAuthenticated()){
//         return next();
//     }
//     res.redirect('content/index')
// }

// const personalProfile = async (req, res) => {

// }

// module.exports = {
//     // showProfilePublicly,
// }