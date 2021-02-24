const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const connectDB = require('../utils/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, errors } = req.body;
    const user = await new User(name, email, password, errors);
    const checkedUser = await connectDB
      .db('eat-my-balls')
      .collection('users')
      .findOne({
        email: email,
      });
    if (checkedUser) {
      return res.status(400).json({
        msg: 'user exists',
      });
    }
    await user.save();

    const payload = {
      user: {
        id: user._id,
      },
    };
    jwt.sign(
      payload,
      process.env.JWTSECRET,
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
        });
      }
    );
    // res.send(user);
  } catch (err) {
    return res.status(500).json({
      msg: err.error,
    });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const db = await connectDB.db('eat-my-balls').collection('users');
  try {
    let user = await db.findOne({
      email: email,
    });
    if (!user) {
      return res.status(400).json({
        msg: 'Invalid Credentials',
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        msg: 'Invalid Credentials',
      });
    }
    const payload = {
      user: {
        id: user._id,
      },
    };
    jwt.sign(
      payload,
      process.env.JWTSECRET,
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
        });
      }
    );
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

exports.createPost = async (req, res) => {
    const user = req.user;
  const { author, title, body } = req.body;
  const post = new Post(author, title, body);
  post.author = user;
  
  jwt.verify(
    req.header('x-auth-token'),
    process.env.JWTSECRET,
    async (err, data) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const postDB = await connectDB.db('eat-my-balls').collection('posts').insertOne(post);
        res.json({
          msg: 'post created',
          post: {
              title: title,
              body: body
          }
        });
      }
    }
  );
};

exports.getAuthorPosts = async (req, res) => {
    try {
        const user = req.user;
        const db = connectDB.db('eat-my-balls').collection('posts');

        const posts = await db.find( {
        author: user
        })
        return res.status(200).json({
            posts
        })
    }
    catch (err) {
        return res.status(500).json({
            msg: err.message
        })
    }
}
