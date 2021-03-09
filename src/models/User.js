const connectDB = require('../utils/db');
const bcrypt = require('bcryptjs');

class User {
  constructor(name, email, password, _id) {
    this.name = name;
    this.email = email;
    this.password = password;
    this._id = _id;
    this.errors = [];
  }

  async save() {
    const db = await connectDB.db('eat-my-balls');
    let password = this.password;
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    await db
      .collection('users')
      .insertOne({
        name: this.name,
        email: this.email,
        password: password,
        errors: this.errors,
      })
      .then(function (res) {
        console.log(res.insertedId);
      });
  }

  async getUserPosts(_id) {
    await connectDB.db('eat-my-balls').collection('posts').find({
      author: _id
    },
    (err, res) => {
      if (err) throw err;
      return res
  })
 
  }
}

module.exports = User;
