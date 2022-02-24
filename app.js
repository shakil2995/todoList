const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const https = require('https');

app.get('/', function (req, res){
    res.sendFile(__dirname+"/static/index.html");
})

app.post('/', function (req, res){
    res.sendFile(__dirname+"/static/success.html");
})


// SERVER 
app.listen(3000,function(req,res){
    console.log("server working on port 3000");
})