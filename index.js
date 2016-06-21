// Importieren der benoetigten Packages
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
exports.io = io;
var path = require('path');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
var displayAllQuestions = require('./datenbankfiles/displayAllQuestionsWithCat');
var getCatsScript = require('./datenbankfiles/getCatsScript');
var quizServer = require('./quizServer');
var fragen;

// View engine wird auf pug gesetzt
app.set('view engine','pug')

app.set('views', path.join(__dirname,'views'));




// Als Bereich fuer die Clienten wird der client Ordner als root verwendet
app.use(express.static(path.resolve(__dirname, 'client')));


// Routing handler
app.get('/',function(req,res){
   res.render('index');
});
app.get('/test',function(req,res){
    res.render('test');
});
app.post('/',function(req,res){
    var reset = req.body.hidden;
    res.render('index',{reset:reset});
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
    res.render('quizmaster');
});
app.get('/success',function(req,res){
    res.render('success');
});

// Globale Variablen werden zur User Kontrolle verwendet
users = [];
available = [];
quizRoom = [];
roomOwner = {};
monitors = {};


io.on('connection', function(socket){
    // Wird von jedem Clienten aufgerufen der auf das Homeverzeichnet verbindet
    // Hier wird eine einzigartige ID generiert, vergeben und versendet
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

    // Ein Monitor Client wird verbunden
    socket.on('monitor',function(data){
        socket.join(data);
        console.log("Monitor ist aktiviert");
        monitors[socket.id]=data;
        socket.emit("test");
    });
    // Fuegt einen Clienten zum lobby Raum hinzu
    socket.on('joinLobby',function(){
       socket.join("lobby");
    });
    // Wird aufgerufen wenn ein Quizmaster eine ID uebermittelt.
    socket.on('initialize',function(data){
        // Es wird ueberprueft ob der Socket mit der ID bereits einen Quizmaster hat
        var len = available.length;
        var k;
        for (var i = 0; i < len; i++){
            if(available[i].nr == data && available[i].connectedTo == "nobody"){
                available[i].connectedTo = socket.id;
                k = i;
            }
        }

        if(available[k] != undefined && available[k] != "undefined"){
            // Wenn die Verbindung vom richtigen Quizmaster aufgebaut wurde wird
            // der Raum eingerichtet
            if(available[k].connectedTo == socket.id) {
                socket.join(data);
                io.sockets.in(data).emit('connectionEstablished');
                console.log("QuizRaum " + data + " wurde eingerichtet.");
                socket.emit("test");
                var nr = parseInt(data);
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
    // Wird verwendet um alte IDs zu aktualisieren
    socket.on('idUpdate',function(data){
        io.sockets.in(data[0]).emit('updateID',data[1]);
    });
    // Ein Spieler wird einem Quiz hinzugefuegt
    socket.on('addPlayer',function(data){
        var user = {socket:socket,id:socket.id,nr:data[1],score:0,name:data[0] || "noUser"};
        users.push(user);
        var nr = parseInt(data[1]);
        socket.join(nr);
        updatePlayers(nr);
    });
    // Eine neue Raumliste wird angefordert und versendet
    socket.on('getUpdate', function(data, callback){
        callback(quizRoom);
    });
    // Wenn ein Client disconnected wird dieser aus den Listen entfernt.
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

    });
    // Wird von einem Quizmaster aufgerufen und laesst alle verbundenen Clienten reseten
    socket.on('reset',function(data){
        io.sockets.in(data).emit('resetClients');
    });
    // Hier wird ein Quiz gestartet mit den uebermittelten Fragen und an quizServer uebergeben.
    socket.on('startQuiz in index',function(data){
        var fragen = data[1];
        var raum = data[0];
        console.log("Quiz " + raum + " wurde gestartet");
        clearRoom(raum);
        quizServer.init(fragen,raum,io);
    });
    // Hier wird die Antwort eines Mitspielers ausgewertet und sein Score zurueckgesendet
    // socket.on('score',function(data){
    //     var user = findPlayerById(socket.id);
    //     user.score += parseInt(data);
    // });
    socket.on('answer',function(data){
        var aktuelleFrage = quizServer.getFrage();
        var user = findPlayerById(socket.id);
        if (aktuelleFrage[5] == aktuelleFrage[data]){
          user.score += 100;
          var score = user.score;
          io.to(socket.id).emit('updateScore',user.score);
        }
    });
    // Hier wird die jeweilige Punkteliste eines Raumes abgefragt und versendet
    socket.on('getList', function(data){
        socket.join(data);
        getScoreList(data);
    });
});
// Ein gestarteter Quizraum kann nicht mehr betreten werden
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
// Findet die id eines bestimmten Spielers
function findPlayerById(id){
  for(var i = 0; i < users.length;i++){
    if (users[i].id === id){
      return users[i];
    }
  }
};
// Aktuelle Mitspielerliste
function updatePlayers(nr){
    var playerList = [];
    var len = users.length;

    for(var i = 0;i < len;i++){
        if(users[i].nr == nr){
            playerList.push(users[i].name);
        }
    }
    io.sockets.in(nr).emit('playerUpdate',playerList);
}
//Hier werden die einzelnen Scores ermittelt und sortiert.
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
