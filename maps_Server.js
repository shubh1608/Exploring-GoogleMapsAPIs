var express = require('express')
var app = express()
var path = require('path');

app.get('/', function (req, res) {
res.sendFile(path.join(__dirname + '/Views/MyMaps_Shubham.html'));
})

app.use(express.static(__dirname + '/public'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})