const express = require('express');
const User = require('../models/User');
const connectDB = require('../utils/db');

exports.createUser = async (req, res, next) => {
    try {
        const { name, email, password, errors } = req.body;
        const user = await new User(name, email, password, errors);
        const checkedUser = await connectDB.db('eat-my-balls').collection('users').findOne({
            email: email
        });
        if (checkedUser) {
            return res.status(400).json({
                msg: 'user exists'
            })
        }
        await user.save();
        res.send(user);
    }
    catch (err) {
        return res.status(500).json({
            msg: err.error
        })
    }
};
