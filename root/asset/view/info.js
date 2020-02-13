const express = require('express')
var app = express()
var mysql = require('mysql')
var path = require('path')
const port = 7000;



app.use('/html', express.static(__dirname + '/html'));
app.use('/html-css', express.static(__dirname + '/html/css'));
app.use('/html-images', express.static(__dirname + '/html/images'));

app.set('views',path.join(__dirname,'html'))
app.set('view engine','hbs')

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

app.get("/", (req, res)=>{
    sql = `select count(*) as count from document`;
    con.query(sql, (err, result)=>{
        Count = Number(result[0].count);
        sql = `select * from document`;
        con.query(sql, (err, result)=>{
        if (err){
            console.log(err);
        }
        else{
        tokenId = result[Count-1].token_id
        DigSig = result[Count-1].dig_sig;
        console.log(tokenId, DigSig)
        sql = `select name from employee where token_id = "${tokenId}"`
        con.query(sql, (err, result)=>{
            name = result[0].name;
            res.render('Info', {Name:name, Tokenid: tokenId, digSig : DigSig});
        })
        
        }
        
        
    });
    })
    
    
});

app.listen(port, ()=>{console.log(`listen at port ${port}`)});
