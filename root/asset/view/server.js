//packages
const express = require('express');
var path = require('path')
var parser = require('body-parser')
var app = express();
var sha256 = require('js-sha256')
var mysql = require('mysql')




app.set('views',path.join(__dirname,'html'))
app.set('view engine','hbs')
app.use(parser.urlencoded({extended:false}));


//variable
const port1 = 5000;
const port2 = 4000;
var loginFlag = false;




//static file
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/images', express.static(__dirname + '/images'));
app.use('/fonts', express.static(__dirname + '/fonts'));
app.use('/html', express.static(__dirname + '/html'));
app.use('/html', express.static(__dirname + '/html'));
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
        console.log(request.body);
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
                var string = encodeURIComponent(sha256(result[0].User));
                response.redirect(`http://localhost:${port2}?valid=` + string);
            } 
            else {
                response.render('Error', {
                    error:'Wrong user name or password',
                    link:'/',
                    method:'get'
                })
            }
        }
    })
})
app.post('/html/signup', urlencoded, (request, response)=>{
    name = request.body.first_name +' '+request.body.last_name;
    pno = request.body.phone_number;
    dob = request.body.date;
    user = request.body.email;
    password = sha256(request.body.pass);
    //token generator
    token = sha256(user);
    var sql = `insert into employee values ("${token}", "${name}", "${pno}", "${dob}", "${user}");`;
    
    con.query(sql, (err, result)=>{
        
        if(err!=null && err.sqlMessage=="Duplicate entry '"+token+"' for key 'PRIMARY'")
        {
        
        response.render('Error',{
            error:"Already Signed up.",
            link:'/',
            method:'get'
        })
        }
        else if(err){
            response.render('Error', {
                error:'could\'t connect to database',
                link:'/',
                method:'get'
            })
        }
        else {
            response.render('submit', {
                Name:name, 
                Token:token,
                link:'/',
                method:'get'
            })
        }
    })
    var sql = `insert into login values ("${user}", "${password}");`;
    con.query(sql);
    var keypair = require('keypair');
    var pair = keypair()
    sql = `insert into tkey values ("${token}", "${pair.public}", "${pair.private}")`;
    con.query(sql);
   
})





    
      
      

app.listen(port1, ()=>console.log(`listening at ${port1}`));



