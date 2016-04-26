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
var fragen;

app.set('view engine','pug')

app.set('views', path.join(__dirname,'views'));





app.use(express.static(path.resolve(__dirname, 'client')));

app.get('/',function(req,res){
   res.render('index');
});

app.post('/monitor',function(req,res){
    var nr = req.body.hidden;
    res.render('monitor',{id: nr});
});
app.post('/client', function(req,res){
    var nr = req.body.nr;
    var nick = req.body.nick;
    res.render('client',{nummer: nr,name: nick});
});
app.post('/success', function(req,res){
    var nr = req.body.hidden;
    console.log(" " + nr);
    res.render('success',{nummer: nr});
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
        var user = {socket:socket,id:socket.id,nr:data[1],score:0,name:data[0] || "noUser"};
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
        //console.log(' disconnected with socketID: ' + socket.id);
    });
    socket.on('startQuiz in index',function(data){
        fragen = data.allQuestions;
        var raum = data.raum;
        console.log("Quiz " + raum + " wurde gestartet");
        clearRoom(raum);
        //console.log(fragen);
        console.log("anzahl der Fragen: " + data.anzahl);
        //var fragen = fragenSimulator.gibMirFragen(data);
        quizServer.init(fragen,raum,io);
    });
    socket.on('score',function(data){
        var user = findPlayerById(socket.id);
        user.score += parseInt(data);
        //console.log(user.name + " hat einen Gesamtpunktestand von " + user.score);
    });
    socket.on('answer',function(data){
        var aktuelleFrage = quizServer.getFrage();
        var user = findPlayerById(socket.id);
        //console.log(user.name + " hat Antwort " + data + " genommen.");
        if (aktuelleFrage[5] == aktuelleFrage[data]){
          user.score += 100;
          var score = user.score;
          //console.log(score);
          io.to(socket.id).emit('updateScore',user.score);

        }
    });

    socket.on('getList', function(data){
        socket.join(data);
        getScoreList(data);
    });
});

function clearRoom(nummer){
    var nr = nummer;
    var length = quizRoom.length;
    for(var i = 0;i<length;i++){
        if(quizRoom[i]==nr){
            quizRoom.splice(i);
            console.log("Quiz " + nr + " kann nicht mehr beigetreten werden.");
            io.sockets.emit('update',quizRoom);
        }
    }
}
function findPlayerById(id){
  for(var i = 0; i < users.length;i++){
    if (users[i].id === id){
      return users[i];
    }
  }
};

function getScoreList(nr){
  var currentScores = [];
  for(var i = 0; i < users.length;i++){
    if(users[i].name != "noUser" && users[i].nr == nr){
      var data = [users[i].name,users[i].score];
      currentScores.push(data);
    }
  }
    io.sockets.in(nr).emit('getListSuccess',currentScores);
};
function sortList(array){
    for(var key in array.name){
        sortArray.push([key,array.name[key]]);
    }
};

http.listen(3000, function(){
  console.log('listening on *:3000');
});
