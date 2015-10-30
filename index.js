
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path');
var addQuestion = require('./mongo');

app.get('/display', function(req, res){
    res.sendFile(path.join(__dirname,'/display.html'));
});
app.get('/', function(req, res){

  res.sendFile(__dirname + '/index.html');
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
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
