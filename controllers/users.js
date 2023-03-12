const User = require("../models/users");
const bcrypt = require('bcrypt');

const showSignUpPage = (req, res) => res.render('users/signup');

const showlogInPage = (req, res) => res.render('users/login');

const signUp = async (req, res) => {
  const { userid, email, password } = req.body;
//   const hashedPassword = bcrypt.hash(password, 10)

  if (!userid || !email || !password) {
    return res.status(400).send('Please provide the information needed');
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    const user = await User.create({ userid, email, password: hashedPassword });
    res.redirect('/users/login');
    res.render('users/login');
  } 
  
  catch (error) {
    console.error('Error saving user:', error);
    res.status(500).send(`Internal server error: ${error.message}`);
  }

};

const logIn = async (req, res) => {

    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();

    if (!user) {
        return res.send('Failed to Log In');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if(!isPasswordMatch){
        return res.send('Failed to Log In')
    }

    res.redirect('/home');
    res.render('content/index')
};

// function ensureAuthenticated (req, res, next) {
//     if (req.isAuthenticated()){
//         return next();
//     }
//     // res.redirect('content/index')
// }


module.exports = {
    signUp,
    logIn,
    showSignUpPage,
    showlogInPage,
    // ensureAuthenticated   
}