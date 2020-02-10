//packages
const express = require('express');
var path = require('path')
var parser = require('body-parser')
var app = express();
app.use(parser.urlencoded({extended:false}));
//static file
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/images', express.static(__dirname + '/images'));
app.use('/fonts', express.static(__dirname + '/fonts'));
app.use('/html', express.static(__dirname + '/html'));
app.use('/html-css', express.static(__dirname + '/html/css'));
app.use('/html-images', express.static(__dirname + '/html/images'));
//parse
var urlencoded = parser.urlencoded({extended:false})
//get request
app.get('/', (req, res)=>{  
    res.sendFile(__dirname + '/index.html');
});
app.post('/html/validate', urlencoded, (request, response)=>{
    console.log(request.body);
})
app.listen(3000);
console.log('connected to port 3000')