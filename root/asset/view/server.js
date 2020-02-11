//packages
const express = require('express');
var path = require('path')
var parser = require('body-parser')
var app = express();
var sha256 = require('js-sha256')
var mysql = require('mysql')
var http = require('http');
var fs = require('fs');
var io = require('socket.io');

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
app.use('/js,', express.static(__dirname + '/html/js'))

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
                

            

                process.on('uncaughtException', function (err) {
                    console.log('uncaught exception: ' + err);
                  });
                  
                  
                  
                  // Allowed content types and extensions.
                  var allowedTypes = {
                    'text/javascript': 'js',
                    'text/css':        'css',
                  
                    'image/png':       'png',
                    'image/jpeg':      'jpg',
                    'image/gif':       'gif',
                    'text/plain':      'txt'
                  };
                  
                  var allowedExtensions = []; // Array of allowed extensions.
                  var contentTypes      = {}; // Reverse lookup of allowedTypes.
                  
                  for (ct in allowedTypes) {
                    allowedExtensions[allowedExtensions.length] = allowedTypes[ct];
                  
                    contentTypes[allowedTypes[ct]] = ct;
                  }
                  
                  // RegExp to test for valid files (only the ones in allowedTypes).
                  // Files must be in a subdirectory so users can't access the javascript files for nodejs.
                  var validFile = new RegExp('^\/[a-z]+\/[0-9a-z\-]+\.('+allowedExtensions.join('|')+')$');
                  
                  
                  
                  var server = http.createServer(function(req, res) {
                      
                    // Serve all allowed files.
                    if (validFile.test(req.url)) {
                      // substr(1) to strip the leading /
                      fs.readFile(req.url.substr(1), function(err, data) {
                        if (err) {
                          res.writeHead(404, {'Content-Type': 'text/plain'});
                          res.end('File not found.');
                        } else {
                          var ext = req.url.substr(req.url.lastIndexOf('.') + 1);
                  
                          res.writeHead(200, {
                            'Content-Type'          : contentTypes[ext],
                            'X-Content-Type-Options': 'nosniff' // We are server user uploaded content so make sure our content type is used instead of sniffing.
                          });
                          res.end(data);
                        }
                      });
                  
                      return;
                    }
                  
                  
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    
                    // Server index.html
                    
                    fs.readFile(__dirname+'/html/document.html', function(err, data) {
                      res.end(data);
                    });
                    
                    
                  });
                  
                  
                server.listen(port2, ()=>console.log(`listen at ${port2}`));
                response.redirect(`http://localhost:${port2}`);
                  var socket = io.listen(server);
                  
                  // Set socket.io logging to normal (comment to get verbose logging).
                  // With verbose logging it will log the whole file content.
                  socket.set('log level', 1);
                  
                  socket.sockets.on('connection', function(client) {
                    client.on('message', function(data) {
                      // data is an URL data scheme with base64 encoding (http://tools.ietf.org/html/rfc2397).
                      data = data.split(';base64,');
                  
                      var type = data[0].substr(5); // strip the data:
                  
                      if (!allowedTypes[type]) {
                        return;
                      }
                  
                      // Decode the base64 data to binary.
                      data = new Buffer(data[1], 'base64').toString('binary');
                  
                      // Get the number of files in the upload dir.
                      fs.readdir('/html/uploads', function(err, files) {
                        // Create a new file with a number as name that is one higher then the current amount of files in the uploads directory.
                        var name = '/html/uploads'+files.length+'.'+allowedTypes[type];
                  
                        fs.writeFile(name, data, 'binary', function(err) {
                          console.log(name+' uploaded');
                  
                          // Send the filename to the client.
                          client.send(name);
                        });
                      });
                    });
                  });
                  
                  
                  // Never let something run as root when it's not needed!
                  if (process.getuid() == 0) {
                    process.setgid('www-data');
                    process.setuid('www-data');
                  }


                
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
   
})





    
      
      

app.listen(port1, ()=>console.log(`listening at ${port1}`));



