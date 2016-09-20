var express = require('express');
var http = require("http");
var path = require("path");
var mongoose = require('mongoose');
var config = require('./config');

var app = express();
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', require('./routes'));
app.use('/app', require('./routes/app'));

mongoose.Promise = Promise;
mongoose.connect(config.mongo.dbUrl, function(err) {
    if(err) throw err;
});

var server = http.createServer(app);
server.listen(8080);

app.use(function (err, req, res, next) {
    if (req.xhr) {
        res.status(500).send({ error: 'Something failed!' });
    } else {
        res.status(500);
        res.render('error', { error: err });
    }
})