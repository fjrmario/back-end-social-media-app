const User = require("../models/users");
const bcrypt = require('bcrypt');

const showSignUpPage = (req, res) => res.render('users/signup');

const showSignInPage = (req, res) => res.render('users/login');

const signUp = async (req, res) => {
  const { userid, email, password } = req.body;

  if (!userid || !email || !password) {
    return res.status(400).send('Please provide the information needed');
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    const user = await User.create({ 
        userid,
        email, 
        password: hashedPassword 
    });
    res.redirect('/users/login');
    res.render('users/login');
  } 
  
  catch (error) {
    console.error('Error saving user:', error);
    res.status(500).send(`Internal server error: ${error.message}`);
  }

};

const signIn = async (req, res) => {

    const { email, password } = req.body;

    try{
        const user = await User.findOne({ email });
        
        if (!user){
            return res.send('Incorrect email');
        }
        
        const validPassword = await bcrypt.compare(password, user.password)
        if(!validPassword){
            return res.send('Incorrect Password')
        }
        
        req.session.userId = user._id

        res.redirect(`/home/${user.userid}`);
        res.render('content/index')

    }

    catch(error){
        console.log(error);
        res.status(500).send(`Internal server error: ${error.message}`)
    }
};

const isAuth = async (req, res, next) => {
    const paramsid = req.params.userid
    const userId = req.session.userId;

    // Searching for session
    if(!userId){
        return res.redirect('/users/login');
    }

    // To Authenticate User
    const user = await User.findById(userId);

    if (!user){
        return res.send('Invalid User');
    }
    
    req.user = user;

    // To Authorise User
    if(paramsid !== req.user.userid){
        return res.send('Not Authorised')
    }

    next();
}

module.exports = {
    signUp,
    signIn,
    showSignUpPage,
    showSignInPage,
    isAuth
}