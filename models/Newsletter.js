//require
const mongoose = require('mongoose');
const {
    isEmail
} = require('validator');

const newsletterSchema = new mongoose.Schema({
    newsmail: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    }
});

const Newsletter = mongoose.model('newsletter', newsletterSchema);
module.exports = Newsletter;