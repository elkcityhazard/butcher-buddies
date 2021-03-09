exports.loadHome =  (req, res) => {
    console.log(req.headers);
    res.render('baseof', {
        title: "Butcher Buddies Home Page"
    })
}