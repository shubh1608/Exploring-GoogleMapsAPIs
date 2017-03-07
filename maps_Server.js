var express = require('express');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var GoogleAuth = require('google-auth-library');
var path = require('path');
var bodyParser = require('body-parser');
var UserAuth = require('./userAuthentication');
var session = require('express-session');
var app = express();
app.use(session({ secret: 'ssshhhhh' }));

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'distracteddev@gmail.com',
        pass: '8103856241'
    }
});

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

app.post('/googleUserSession', function (req, res) {
    console.log("Inside google user session userName:" + req.body.userName);
    sess = req.session;
    sess.userName = req.body.userName;
    res.send(true);
    //console.log(req.body.tokenId);
    //var auth = new GoogleAuth;
    //var client = new auth.OAuth2('NRngF-ONAZm0ekItlPPvzjZY', '', '');
    //console.log(client);
    //client.verifyIdToken(
    //    req.body.tokenId,
    //    'NRngF-ONAZm0ekItlPPvzjZY',
    //    // Or, if multiple clients access the backend:
    //    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
    //    function (e, login) {
    //        if (e)
    //            console.error(e);
    //        console.log(login);
    //        var payload = login.getPayload();
    //        var userid = payload['sub'];
    //        console.log("UserID from google server:" + userid)
    //        res.send(true);
    //        // If request specified a G Suite domain:
    //        //var domain = payload['hd'];
    //    });
});

app.post('/facebookUserSession', function (req, res) {
    console.log("Inside FB user session userName:" + req.body.userName);
    sess = req.session;
    sess.userName = req.body.userName;
    res.send(true);
});

app.get('/forgotPassword', function (req, res) {
    res.sendFile(path.join(__dirname + '/Views/ForgotPassword.html'));
});

app.get('/resetPassword', function (req, res) {
    res.sendFile(path.join(__dirname + '/Views/ResetPassword.html'));
});

app.post('/passwordResetMail', function (req, res) {
    var mailId = req.body.mailId;
    var mailOptions = {
        from: 'distracteddev@gmail.com', // sender address
        to: mailId, // list of receivers
        subject: 'Password Reset Mail - GoogleMapsAPI', // Subject line
        text: '', // plain text body
        html: '<b><a href="http://localhost:3000/resetPassword">Click here to reset password</a></b>' // html body
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
        res.send(true);
    });
});

app.post('/resetPasswordInDataBase', function (req, res) {
    var userName = req.body.userName;
    var newPassword = req.body.newPassword;
    var confirmPassword = req.body.confirmPassword;
    var query = { 'UserName': req.body.userName };
    var updatedDoc = {
        UserName: req.body.userName,
        Password: req.body.confirmPassword,
    };
    UserAuth.findOneAndUpdate(query, updatedDoc, { upsert: true }, function (err, doc) {
        if (err) return res.send(500, { error: err });
        return res.send(true);
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