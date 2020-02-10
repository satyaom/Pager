//packages
const express = require('express');
var path = require('path')
var parser = require('body-parser')
var app = express();
var mysql = require('mysql')
app.use(parser.urlencoded({extended:false}));
const hbs = require('hbs')

//variable
const port = 3000

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

//create connection
var con = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '0184',
    database: 'pager'
});
con.connect((err)=>{
    if (err) throw err;
    console.log('connected!')
})

//get request
app.get('/', (req, res)=>{  
    res.sendFile(__dirname + '/index.html');
});

// taking input from login page
app.post('/html/validate', urlencoded, (request, response)=>{
    var sql = `SELECT * FROM login where User="${request.body.username}"`;
    con.query(sql, (err, result)=>{
        if(err){
            response.render('Error', {
                error:'could\'t connect to database try later',
                link:'/',
                method:'get'
            })
        }
        else if(result.length == 0) {
            response.render('Error',{
                error: 'Wrong user name or password',
                link:'/',
                method: 'get'
            })
        }
        else{
            var pass = result[0].Pass;
            //use sha algo to check password
            hashpass = sha256(request.body.pass);
            
            if(pass == hashpass) {
                response.sendFile(__dirname+'/html/documentPage.html')
            } 
            else {
                response.render('Error', {
                    error:'Wrong user name or password',
                    link:'/html',
                    method:'get'
                })
            }
        }
    })
})
app.listen(port, ()=>console.log(`listening at ${port}`));
