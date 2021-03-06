const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 4000;
const ejs = require('ejs');

    //  Set up static files
    app.use('/static', express.static(path.join(__dirname, 'public')))

    //  hook up json 
app.use(express.json());
app.use(express.urlencoded({extended: true}));

    //   Set Up View Directory & View Engine
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs');

    //  hook up routes
app.use('/api/user', require('./routes/api/user'));
app.use('/', require('./routes/front'));

    //  404 Error
app.get('*', (req, res, next) => {
    res.send('404 page');
})

//  start app

app.listen(port, async (req, res) => {
    await console.log('listening on port: ', port);
})

