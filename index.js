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
var displayAllQuestions = require('./datenbankfiles/displayAllQuestionsWithCat');
var getCatsScript = require('./datenbankfiles/getCatsScript');
var quizServer = require('./quizServer');
var fragen;

app.set('view engine','pug')

app.set('views', path.join(__dirname,'views'));





app.use(express.static(path.resolve(__dirname, 'client')));

app.get('/',function(req,res){
   res.render('index');
});
app.get('/test',function(req,res){
    res.render('test');
});
app.post('/',function(req,res){
    var reset = req.body.hidden;
    console.log(reset + " hier war der Reset");
    res.render('index',{reset:reset});
})


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
app.post('/lobby',function(req,res){
   var nick = req.body.hidden;
    res.render('lobby',{name:nick});
});


app.get('/lobby', function(req, res){
    res.render('lobby');
});
app.get('/quizmaster',function(req,res){
    res.render('test');
});
app.get('/success',function(req,res){
    res.render('success');
});

users = [];
available = [];
quizRoom = [];
roomOwner = {};
monitors = {};


io.on('connection', function(socket){

    socket.on('ready',function(){
        var random = Math.floor(Math.random()*10000);
        while(available.indexOf(random)>-1){
            random = Math.floor(Math.random()*10000);
        }
        var connected = {socket:socket,id:socket.id,nr:random,isConnected:"false",connectedTo:"nobody"};
        available.push(connected);
        roomOwner[socket.id]=random;
        socket.emit('id',random);
        socket.join(random);
    });
    socket.on('monitor',function(data){
        socket.join(data);
        console.log("Monitor ist aktiviert");
        monitors[socket.id]=data;
        socket.emit("test");
    });
    socket.on('joinLobby',function(){
       socket.join("lobby");
    });
    socket.on('initialize',function(data){
        var len = available.length;
        var k;
        for (var i = 0; i < len; i++){
            if(available[i].nr == data && available[i].connectedTo == "nobody"){
                available[i].connectedTo = socket.id;
                k = i;
            }
        }
        if(available[k] != undefined && available[k] != "undefined"){
            if(available[k].connectedTo == socket.id) {
                socket.join(data);
                io.sockets.in(data).emit('connectionEstablished');
                console.log("QuizRaum " + data + " wurde eingerichtet.");
                socket.emit("test");
                var nr = parseInt(data);
               // console.log(nr);
                if (quizRoom.indexOf(nr) > -1) {

                } else {
                    quizRoom.push(nr);

                }
                io.sockets.in("lobby").emit('update', quizRoom);
            }
        }else{
            io.to(socket.id).emit('wrongID');
        }
    });
    socket.on('idUpdate',function(data){
        io.sockets.in(data[0]).emit('updateID',data[1]);
    })
    socket.on('addPlayer',function(data){
        var user = {socket:socket,id:socket.id,nr:data[1],score:0,name:data[0] || "noUser"};
        users.push(user);
        //console.log(user.name + ' connected with socketID: ' + user.id);
        var nr = parseInt(data[1]);
        socket.join(nr);
        updatePlayers(nr);
    });
    socket.on('getUpdate', function(data, callback){
        callback(quizRoom);
    });

    socket.on('disconnect', function(){
        // var user = users[socket.id];
        var len = users.length;

        for(var i = 0;i < len; i++){
            var leng = users[i].length;
            if(users[i].id === socket.id){
                var nr = users[i].nr;
                //users[i].nr = 0;
                users[i].nr= 0;
                updatePlayers(nr);
            }
        }
        if(monitors[socket.id] != undefined){

            var nr = monitors[socket.id];
            delete monitors[socket.id];
            clearRoom(nr);
        }

        //console.log(' disconnected with socketID: ' + socket.id);
    });
    socket.on('reset',function(data){
        io.sockets.in(data).emit('resetClients');
    });
    socket.on('startQuiz in index',function(data){
        var fragen = data[1];
        var raum = data[0];
        console.log("Quiz " + raum + " wurde gestartet");
        clearRoom(raum);
        //console.log(fragen);
        //console.log("anzahl der Fragen: " + data.anzahl);
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
};
function findPlayerById(id){
  for(var i = 0; i < users.length;i++){
    if (users[i].id === id){
      return users[i];
    }
  }
};
function updatePlayers(nr){
    var playerList = [];
    var len = users.length;

    for(var i = 0;i < len;i++){
        //var test = users[i].nr
        if(users[i].nr == nr){
            playerList.push(users[i].name);
        }
    }
    //console.log("playerlist: " + playerList);
    io.sockets.in(nr).emit('playerUpdate',playerList);
}
function getScoreList(nr){
  var currentScores = [];
  for(var i = 0; i < users.length;i++){
      if(users[i].name != "noUser" && users[i].nr == nr){
        var data = [users[i].name,users[i].score];
        currentScores.push(data);
      }
  }
    var sorted = selectionSort(currentScores);
    io.sockets.in(nr).emit('getListSuccess',sorted);
};
function selectionSort(arr){
    var maxIdx, temp,
        len = arr.length;
    for(var i = 0; i < len; i++){
        maxIdx = i;
        for(var  j = i+1; j<len; j++){
            if(arr[j][1]>arr[maxIdx][1]){
                maxIdx = j;
            }
        }
        temp = arr[i];
        arr[i] = arr[maxIdx];
        arr[maxIdx] = temp;
    }
    return arr;
};

http.listen(3000, function(){
  console.log('listening on *:3000');
});
