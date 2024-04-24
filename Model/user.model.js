const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const secretKey = 'myFirstWebsitetodevloapmyself';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: String,
    },
    token: {
        type: String
    }
});

userSchema.methods.generateAuthToken = function (role) {
    const user = this;
    const token = jwt.sign({ _id: user._id, username: user.username, roles: user.roles }, secretKey);

    user.token = token;
    user.save();
    return token;
};

const usermodel = mongoose.model('User', userSchema);

module.exports = usermodel;