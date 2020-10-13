//require
const mongoose = require('mongoose');
const {
    isEmail
} = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    pwd: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [8, 'Minimum length required is 8 characters']
    }

});

//execute function before doc saved in db
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.pwd = await bcrypt.hash(this.pwd, salt);
    next();


})

//static method to login user
userSchema.statics.login = async function (email, pwd) {
    const user = await this.findOne({
        email
    });
    if (user) {
        const auth = await bcrypt.compare(pwd, user.pwd);
        if (auth) {
            return user;
        }
        throw Error('Incorrect password');
    }
    throw Error('Incorrect email');
}

const User = mongoose.model('user', userSchema);
module.exports = User;