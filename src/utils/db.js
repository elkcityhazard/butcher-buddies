const { MongoClient } = require('mongodb');
const dotenv = require('dotenv').config();


const client = new MongoClient(process.env.CONNECTION_URI, { useNewUrlParser: true });
client.connect((err, client) => {
    if (err) {
        res.status(500).json({
            msg: err.message
        })
    }
})
 

module.exports = client;


