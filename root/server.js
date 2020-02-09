const express = require('express');
var bodyParser = require('body-parser');
var sha256 = require('js-sha256');
var app = express();
var fs = require('fs');
var io = require('socket-io');
var http = require('http');

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/asset/view/index.html')
});

app.listen(8000);