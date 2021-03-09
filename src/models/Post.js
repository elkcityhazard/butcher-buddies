const connectDB = require('../utils/db');
const posts = connectDB.db('eat-my-ass').collection('posts');

class Post {
    constructor (author, title, body) {
        this.author = author;
        this.title = title;
        this.body = body;
    }
    
}


module.exports = Post;