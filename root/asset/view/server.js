const express = require('express');
var path = require('path')
var app = express();

app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'js')));
app.use(express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'fonts')));
app.get('/', (req, res)=>{  
    res.sendFile(__dirname + '/index.html');
});






app.listen(2000);
console.log('connected to port 3000')