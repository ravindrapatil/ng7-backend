const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var profileSchema = new Schema({
    // userID: { type: mongoose.Schema.Types.ObjectId },
    addressOne: { type: String, required: true },
    addressTwo: { type: String},
    phoneNo: { type: Number, required: true },
    altPhoneNo: { type: Number },
    profile: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }
});

module.exports = mongoose.model('Profile', profileSchema);