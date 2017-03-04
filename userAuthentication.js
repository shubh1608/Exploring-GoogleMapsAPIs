var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://shubham:pulsar%40150@ds157439.mlab.com:57439/googlemapsusers');
var userAuthSchema = new Schema({ id: Number, UserName:String,Password:String });
var UserAuthentication = mongoose.model('UserAuthentication', userAuthSchema);
module.exports = UserAuthentication;
