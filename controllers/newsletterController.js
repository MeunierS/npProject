//require
const Newsletter = require('../models/Newsletter');

//* Functions

//handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {
        newsmail: ''
    };
    //duplicate email in db
    if (err.code === 11000) {
        errors.newsmail = 'That email is already in use';
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

//* POST
module.exports.newsletter_post = async (req, res) => {
    const {
        newsmail
    } = req.body;
    try {
        const newsletter = await Newsletter.create({
            newsmail
        });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({
            errors
        });
    }
}