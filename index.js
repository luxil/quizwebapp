var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path');
var addQuestion = require('./mongo');
var quizServer = require('./quizServer');
var fragenSimulator = require('./dbrandomsimulator');

app.use('/', express.static(__dirname,'/'));

app.get('/display', function(req, res){
    res.sendFile(path.join(__dirname,'/monitor.html'));
});
app.get('/controller', function(req, res){

  res.sendFile(__dirname + '/client2.html');
});
app.get('/admin',function(req,res){
  res.sendFile(__dirname + '/quizmaster.html');
});
users = [];

//addQuestion.addQuestions('karo?','linh','byron','max','moritz');

io.on('connection', function(socket){
  socket.on('addPlayer',function(data){
  var user = {socket:socket,id:socket.id,score:0,name:data || "noUser"};
  users.push(user);
  console.log(user.name + ' connected with socketID: ' + user.id);
  });
  socket.on('disconnect', function(){
   // var user = users[socket.id];
    delete users[socket.id];
    console.log(' disconnected with socketID: ' + socket.id);
  });
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
	io.emit('chat message', msg);
  });
  socket.on('startQuiz',function(data){
    var fragen = fragenSimulator.gibMirFragen(data);
    quizServer.init(fragen,io);
  });
  socket.on('score',function(data){
    var user = findPlayerById(socket.id);
    user.score += parseInt(data);
    console.log(user.name + " hat einen Gesamtpunktestand von " + user.score);
  });
});

function findPlayerById(id){
  for(var i = 0; i < users.length;i++){
    if (users[i].id === id){
      return users[i];
    }
  }
};


http.listen(3000, function(){
  console.log('listening on *:3000');
});
