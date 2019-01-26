// packages 
var express = require('express');
var app = express();
const path = require('path');
var http = require('http').Server(app);

// serve static content in public 
app.use(express.static('public'));

// this is how routes are handled
app.get('/',function(req,res) {
  res.sendFile(path.join(__dirname+'/views/index.html'));
});

// launch server
console.log('running on localhost:8080');
http.listen(process.env.PORT || 8080);