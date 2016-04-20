var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
exports.io = io;
var path = require('path');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
//var addQuestion = require('./mongo');
var displayAllQuestions = require('./datenbankfiles/displayAllQuestions');
var quizServer = require('./quizServer');
var fragenSimulator = require('./dbrandomsimulator');
var fragen;

app.set('view engine','pug')

app.set('views', path.join(__dirname,'views'));





app.use(express.static(path.resolve(__dirname, 'client')));

app.get('/',function(req,res){
   res.render('index');
});

app.post('/monitor',function(req,res){
    var nr = req.body.hidden;
    console.log(nr);
    res.render('monitor',{id: nr});
});
app.post('/client', function(req,res){
    var nr = req.body.nr;
    var nick = req.body.nick;
    console.log(nick + " " + nr);
    res.render('client',{nummer: nr,name: nick});
});


app.get('/monitor', function(req, res){
    res.render('monitor');
});
app.get('/lobby', function(req, res){
    res.render('lobby');
});
app.get('/quizmaster',function(req,res){
    res.render('quizmaster');
});
app.get('/success',function(req,res){
    res.render('success');
});

users = [];
available = [];
quizRoom = [];
roomOwner = {};



io.on('connection', function(socket){
    socket.on('ready',function(){
        var random = Math.floor(Math.random()*10000);
        while(available.indexOf(random)>-1){
            random = Math.floor(Math.random()*10000);
        }
        var connected = {socket:socket,id:socket.id,nr:random,isConnected:"false"};
        available.push(connected);
        roomOwner[socket.id]=random;
        socket.emit('id',random);
        socket.join(random);
    });
    socket.on('initialize',function(data){
        socket.join(data);
        io.sockets.in(data).emit('connectionEstablished');
        console.log("QuizRaum " + data + " wurde eingerichtet.");
        var nr = parseInt(data);
        console.log(nr);
        io.sockets.in(nr).emit('update',quizRoom);
        if(quizRoom.indexOf(nr)> -1){

        }else{
            quizRoom.push(nr);

        }

    });

    socket.on('addPlayer',function(data){
        var user = {socket:socket,id:socket.id,score:0,name:data[0] || "noUser"};
        users.push(user);
        console.log(user.name + ' connected with socketID: ' + user.id);
        var nr = parseInt(data[1]);
        socket.join(nr);
    });
    socket.on('getUpdate', function(callback, data){
        data(quizRoom);
    });

    socket.on('disconnect', function(){
        // var user = users[socket.id];
        delete users[socket.id];
        console.log(' disconnected with socketID: ' + socket.id);
    });
    socket.on('startQuiz in index',function(data){
        fragen = data.allQuestions;
        var raum = data.raum;
        console.log(raum + "was ist hier looos?");
        console.log("startquiz");
        console.log(fragen);
        console.log("anzahl der Fragen: " + data.anzahl);
        //var fragen = fragenSimulator.gibMirFragen(data);
        quizServer.init(fragen,raum,io);
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
