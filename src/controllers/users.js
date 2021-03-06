const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const connectDB = require('../utils/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { ObjectID } = require('mongodb');

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, errors} = req.body;
       const user = new User(name, email, password, errors);
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
    const id = await connectDB.db('eat-my-balls').collection('users').findOne({
      email: email
    }).then(res => {return res._id})
    const payload = {
      user: id
    };
    console.log(payload)
    jwt.sign(
      payload,
      process.env.JWTSECRET,
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.json({token})
      }
    );
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
    console.log("user: ", user._id)
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
        id: user._id
    };
    jwt.sign(
      payload,
      process.env.JWTSECRET,
      { expiresIn: '5 days' },
      async (err, token) => {
        if (err) throw err;
        req.header.authorization = token;
        let posts = connectDB.db('eat-my-balls').collection('posts').find({
              author: payload.id
            })
        console.log("payload:", payload)
        res.status(200).render('loggedIn', {
          token: token,
          title: `Hello ${user.email}`,
          email: `${user.email}`,
          
        })
  })
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

exports.createPost = async (req, res) => {
  console.log(req.body);
  const { author, title, body } = req.body;
  const post = new Post(author, title, body);
  post.author = req.user
          const postDB = await connectDB
          .db('eat-my-balls')
          .collection('posts')
          .insertOne(post);
        res.json(post);
      };

exports.getPost = async (req, res) => {
  const {postID} = req.params;
  
  try {
  const post = await connectDB.db('eat-my-balls').collection('posts').findOne({
    _id: postID
  }).then((data) => {
      return data;
  })
  res.status(200).json({post})
  } 
  catch (err) {
    return res.status(500).json({
      msg: err.message
    })
  }
  
}

exports.getAuthorPosts = async (req, res) => {
  try {
    const user = req.user;
    const db = await connectDB.db('eat-my-balls').collection('posts');
    const posts = await db
      .find({
        author: user.id,
      })
      .toArray(function (err, result) {
        if (err) throw err;
        let postsClone = { ...result };
        res.status(200).send(postsClone);
      });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const user = req.user;
    const { _id, title, body } = req.body;
    const id = new ObjectID(_id);
    const db = await connectDB.db('eat-my-balls').collection('posts');
    const searchResult = await db.findOne({
      _id: id
    });
    if (!searchResult) {
      return res.status(400).json({
        msg: "post not found"
      })
    }
    await db.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          title: title,
          body: body,
        },
      },
      { new: true, upsert: true, returnOriginal: false }
    );
    res.status(200).json({
      _id: _id,
      title: title,
      body: body,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

exports.deleteSinglePost = async (req, res) => {
  try {
    const user = req.user;
    const { _id } = req.body;
    const id = new ObjectID(_id);
    const db = await connectDB.db('eat-my-balls').collection('posts');
    const searchResult = await db.findOne({
      _id: id
    });
    if (!searchResult) {
      return res.status(400).json({
        msg: "post not found"
      })
    }
    await db.findOneAndDelete({
      _id: id,
    });
    res.status(200).json({
      msg: "deleted the following post:",
      id: _id,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};


exports.deleteAllPosts = async (req, res) => {
  try {
    const user = req.user;
    const db = await connectDB.db('eat-my-balls').collection('posts');
    const searchResult = await db.findOne({
      author: user.id
    });
    if (!searchResult) {
      return res.status(400).json({
        msg: "post not found"
      })
    }
    await db.deleteMany({
      author: user.id
    });
    res.status(200).json({
      msg: "deleted all posts for the following user:",
      id: user.id,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
}