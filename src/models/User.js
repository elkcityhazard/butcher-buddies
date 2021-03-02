const connectDB = require('../utils/db');
const bcrypt = require('bcryptjs');

class User {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
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
}

module.exports = User;
