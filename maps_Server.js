var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var UserAuth = require('./userAuthentication');
var session = require('express-session');
var app = express();
app.use(session({ secret: 'ssshhhhh' }));

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

var sess;
app.get('/', function (req, res) {
    sess = req.session;
    console.log(sess.userName + "in /");
    if (sess.userName) {
        res.sendFile(path.join(__dirname + '/Views/MyMaps.html'));
    } else {
        res.sendFile(path.join(__dirname + '/Views/Login.html'));
    }
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/Views/Login.html'));
});

app.get('/MyMaps', function (req, res) {
    console.log("In");
    res.sendFile(path.join(__dirname + '/Views/MyMaps.html'));
});

app.post('/usersAuthentication', function (req, res) {
    sess = req.session;
    sess.userName = req.body.userName;
    console.log(sess.userName + "in /usersAuthentication");
    UserAuth.find({
        UserName: req.body.userName,
        Password: req.body.password,
    }).count(function (err, count) {
        if (err) return console.error(err);
        if (count > 0)
            res.send(true);
        else
            res.send(false);
    });
});

app.post('/registerUser', function (req, res) {
    console.log(req.body.userName + " " + req.body.password);
    var user = new UserAuth({ 'UserName': req.body.userName, 'Password': req.body.password });
    user.save(function (err, user) {
        if (err) {
            console.error(err);
            res.send(false);
        } else {
            res.send(true);
        }
    });
});




app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});

app.get('/logout', function (req, res) {
    console.log("Inside logout");
    req.session.destroy(function (err) {
        if (err) console.log(err);
        else res.send(true);
    });
});