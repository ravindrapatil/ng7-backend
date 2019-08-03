const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

var schema = new Schema({
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    creation_dt: { type: String, required: true }
    // profile: [{ 
    //     type: mongoose.Schema.Types.ObjectId, 
    //     ref: 'Profile'
    // }]
});

schema.statics.hashPassword = function hashPassword(password) {
    return bcrypt.hashSync(password, 10);
};

schema.method.isValid = function(hashPassword) {
    return bcrypt.compareSync(hashPassword, this.password);
};

module.exports = mongoose.model('User', schema);