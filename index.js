var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
exports.io = io;
var path = require('path');
//var addQuestion = require('./mongo');
var displayAllQuestions = require('./datenbankfiles/displayAllQuestions');
var quizServer = require('./quizServer');
var fragenSimulator = require('./dbrandomsimulator');
var fragen;

app.set('view engine','pug')

app.set('views', path.join(__dirname,'views'));





app.use(express.static(path.resolve(__dirname, 'client')));

app.get('/monitor', function(req, res){
    res.render('./monitor');
});
app.get('/client2', function(req, res){
    res.render('./client2');
});
app.get('/quizmaster',function(req,res){
    res.render('./quizmaster');
});
app.get('/success',function(req,res){
    res.render('./success');
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
  socket.on('startQuiz in index',function(data){
    fragen = data.allQuestions;
    console.log("startquiz");
    console.log(fragen);
    console.log("anzahl der Fragen: " + data.anzahl);
    //var fragen = fragenSimulator.gibMirFragen(data);
    quizServer.init(fragen,io);
  });
  socket.on('score',function(data){
    var user = findPlayerById(socket.id);
    user.score += parseInt(data);
    console.log(user.name + " hat einen Gesamtpunktestand von " + user.score);

  });
  socket.on('answer',function(data){
    var aktuelleFrage = quizServer.getFrage();
    var user = findPlayerById(socket.id);
    console.log(user.name + " hat Antwort " + data + " genommen.");
    if (aktuelleFrage[5] == aktuelleFrage[data]){
      user.score += 100;
      var score = user.score;
      console.log(score);
      io.to(socket.id).emit('updateScore',user.score);

    }
  });

  socket.on('getList', function(data,callback){
    //console.log("hier kam was");
    var data = getScoreList();
    callback(data);
  });
});


function findPlayerById(id){
  for(var i = 0; i < users.length;i++){
    if (users[i].id === id){
      return users[i];
    }
  }
};

function getScoreList(){
  //console.log("scorelistenanfrage");
  var currentScores = [];
  for(var i = 0; i < users.length;i++){
    if(users[i].name != "noUser"){
      var data = [users[i].name,users[i].score];
      currentScores.push(data);
    }
  }
  return currentScores;
};


http.listen(3000, function(){
  console.log('listening on *:3000');
});
