const User = require('../models/users');
const Profile = require('../models/profiles');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.create_user = (req, res, next) => {
    User.find({ email: req.body.email })
        .then(user => {
            if (user.length >= 1) {
                console.log(user);
                return res.status(409).json({
                    statusCode: 409,
                    message: 'Email Already Exists. Please try with other email ID' 
                });
            } else {
                var user = new User({
                    email: req.body.email,
                    username: req.body.username,
                    password: User.hashPassword(req.body.password),
                    creation_dt: Date.now()
                });

                user.save()
                    .then((result) => {
                        console.log(result);
                        res.status(200).json({
                            statusCode: 200,
                            message: 'New User created successfully. You will be redirected to login page.'
                        })
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(500).json({
                            statusCode: 500,
                            error: err
                        })
                    });
            }
        })
        .catch(err => {
            res.status(500).json({
                statusCode: 500,
                error: err
            })
        })
}

exports.loginUser = (req, res, next) => {
    User.find({ email: req.body.email })
        .then(user => { // Here user is an array of users.
            if (user.length < 1) {
                return res.status(401).json({
                    statusCode: 401,
                    message: 'Auth Failed'
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        statusCode: 401,
                        message: 'Auth Failed. Please try with valid credentials'
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        'secret',
                        {
                            expiresIn: '1h'
                        }
                    )
                    return res.status(201).json({
                        statusCode: 201,
                        message: 'Auth Successfull. You will be redirected to Dashboard',
                        token: token
                    });
                }
                return res.status(401).json({
                    statusCode: 401,
                    message: 'Auth Failed. Please try with valid credentials'
                })
            })
        })
}

exports.getAllUsers = (req, res, next) => {
    User.find()
        .then((result) => {
            res.status(201).json({
                statusCode: 201,
                users: result
            })
        })
        .catch(err => {
            res.status(500).json({
                statusCode: 500,
                error: err
            })
        })
}

exports.getSingleUser = (req, res, next) => {
    const id = req.params.userId;
    User.find({ _id: id })
        .then(result => {
            res.status(201).json({
                statusCode: 201,
                user: result,
                message: "Successfully pulled single user"
            })
        })
        .catch(err => {
            res.status(500).json({
                statusCode: 500,
                error: err
            })
        })
}

exports.updateProfile = (req, res, next) => {
    const userId = req.params.userId;
    console.log('userId');
    const profileData = new Profile({
        // userID: userId,
        addressOne: req.body.addressOne,
        addressTwo: req.body.addressTwo,
        phoneNo: req.body.phoneNo,
        altPhoneNo: req.body.altPhoneNo,
        profile: userId
    })
    profileData.save()
        .then((result) => {
            console.log(result);
            Profile.find({ profile: userId })
                .populate('profile')
                .then(result => {
                    res.status(201).json({
                        statusCode: 201,
                        user: result,
                        message: "Successfully pulled single user 3333"
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        statusCode: 500,
                        error: err
                    })
                })
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                statusCode: 500,
                error: err
            })
        });
}

// exports.getProfile = async (req, res, next) => {
//     const { userId } = req.params;
//     const user = await User.findById(userId).populate('profile');

//     res.status(201).json({
//         msg: 'Data saved',
//         result: user
//     })
// }

//https://www.youtube.com/playlist?list=PLxnSeqQVewBPkFyAYzkeKqmxejJpz31H8