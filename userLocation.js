var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://shubham:pulsar%40150@ds157439.mlab.com:57439/googlemapsusers');
var userLocationSchema = new Schema({ id: Number, lat: String, lng: String });
var UserLoc = mongoose.model('UserLocation', userLocationSchema);
module.exports = UserLoc;
