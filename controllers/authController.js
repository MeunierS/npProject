//require
const User = require('../models/User');
const jwt = require('jsonwebtoken');

//* Functions
//handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {
        email: '',
        pwd: ''//,
       // pseudo: ''
    };

    //incorrect email
    if (err.message === 'Incorrect email') {
        errors.email = 'email is not registered';
    }

    //incorrect password
    if (err.message === 'Incorrect password') {
        errors.pwd = 'wrong password';
    }

    //duplicate email or pseudo
    if (err.code === 11000) {
        errors.email = 'That email is already in use';
       // errors.pseudo = 'That pseudo is already in use';
        return errors;
    }

    //validation error
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({
            properties
        }) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}

//create JWT
//! delete secret before push
const maxAge = 24 * 60 * 60; //1 day value
const createToken = (id) => {
    return jwt.sign({
        id
    }, 'patate secret', {
        expiresIn: maxAge
    });
}
//* GET
module.exports.signup_get = (req, res) => {
    res.render('signup');
}
module.exports.login_get = (req, res) => {
    res.render('login');
}
module.exports.logout_get = (req, res) => {
    res.cokkie('jwt', '', {
        maxAge: 1
    });
    res.redirect('/');
}



//* POST
module.exports.signup_post = async (req, res) => {
    const {
        email,
        pwd,
      //  pseudo
    } = req.body;
    try {
        const user = await User.create({
            email,
            pwd//,
         //   pseudo
        });
        const token = createToken(user._id);
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000
        });
        res.status(201).json({
            user: user._id
        });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({
            errors
        });
    }
}
module.exports.login_post = async (req, res) => {
    const {
        email,
        pwd
    } = req.body;
    try {
        const user = await User.login(email, pwd);
        const token = createToken(user._id);
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000
        });
        res.status(200).json({
            user: user._id
        })
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({
            errors
        });
    }
}