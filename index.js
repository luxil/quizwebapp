var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path');
var addQuestion = require('./mongo');
var quizServer = require('./quizServer')

app.use('/', express.static(__dirname,'/'));

app.get('/display', function(req, res){
    res.sendFile(path.join(__dirname,'/display.html'));
});
app.get('/', function(req, res){

  res.sendFile(__dirname + '/index.html');
});
app.get('/admin',function(req,res){
  res.sendFile(__dirname + '/quizmaster.html');
});


addQuestion.addQuestions('karo?','linh','byron','max','moritz');

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
	io.emit('chat message', msg);
  });
  socket.on('startQuiz',function(){
    quizServer.init();
  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
