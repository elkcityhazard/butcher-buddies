const express = require('express');
const app = express();
const port = process.env.PORT || 4000;


    //  hook up json 
app.use(express.json());

    //  hook up routes
app.use('/api/user', require('./routes/api/user'));

    //  404 Error
app.get('*', async (req, res, next) => {
    await res.send('404 page');
})

//  start app

app.listen(port, async (req, res) => {
    await console.log('listening on port: ', port);
})