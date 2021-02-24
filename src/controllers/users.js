const express = require('express');
const User = require('../models/User');
const connectDB = require('../utils/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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

        const payload = {
            user : {
                id: user._id
            }
        };
        jwt.sign(
            payload,
            process.env.JWTSECRET,
            {expiresIn: '5 days'},
            (err, token) => {
                if (err) throw err;
                res.json({
                    token
                })
            })
        // res.send(user);
    }
    catch (err) {
        return res.status(500).json({
            msg: err.error
        })
    }
};

exports.loginUser = async (req, res ) => {
    const {email, password} = req.body;
    const db = await connectDB.db('eat-my-balls').collection('users');
    try {
        let user = await db.findOne({
            email: email
        })
        if (!user) {
            return res.status(400).json({
                msg: 'Invalid Credentials'
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({
                msg: 'Invalid Credentials'
            })
        }
        const payload = {
            user: {
                id: user._id
            }
        }
        jwt.sign(
            payload,
            process.env.JWTSECRET,
            { expiresIn: '5 days'},
            (err, token) => {
                if (err) throw err;
                res.json({
                    token
                })
            }
        )
    }
    catch (err) {
        return res.status(500).json({
            msg: err.message
        })
    }
}
