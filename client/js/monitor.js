function monitor(){
    var socket = io();
    // Selectoren
    var timer = document.getElementById("timer");
    var question = document.getElementById("question");
    var A = document.getElementById("A");
    var B = document.getElementById("B");
    var C = document.getElementById("C");
    var D = document.getElementById("D");
    var mA = document.getElementById("mA");
    var mB = document.getElementById("mB");
    var mC = document.getElementById("mC");
    var mD = document.getElementById("mD");
    var id = document.getElementById("id");
    var form = document.getElementById("form");
    var formReset = document.getElementById("formReset");
    var hidden = document.getElementById("hidden");
    var hidden1 = document.getElementById("hidden1");
    var p = document.getElementById("players");


    //Client meldet sich bei dem Quiz als monitor an
    var nr = parseInt(id.innerHTML);
    socket.emit('monitor',nr);

    // Socket handler

    // Timer wird hier aktualisiert
    socket.on('timerUpdate',function(data){

       timer.innerHTML = "<h3>"+ data + "</h3>";
    });

    // Eine neue Frage wird auf die korrekten Elemente verteilt
    socket.on('questionUpdate',function(data){
        mA.className = "col-xs-6";
        mB.className = "col-xs-6";
        mC.className = "col-xs-6";
        mD.className = "col-xs-6";
        question.innerHTML = data[0];
        A.innerHTML = data[1];
        B.innerHTML = data[2];
        C.innerHTML = data[3];
        D.innerHTML = data[4];


    });
    // Die aktuellen Spieler werden angezeigt
    socket.on('playerUpdate',function(data){
        console.log(data);
        $(p).empty();
        data.forEach(showPlayer);
    });
    // Verbindungsaufbau wird angezeigt
    socket.on('test',function(){
       console.log("Connection established");
    });
    // Wird ausgeloest um am Ende des Quiz zu success zu gelangen
    socket.on('updateScore',function(){
        hidden.setAttribute("value",nr);
        form.submit();

    });
    // Wird vom Quizmaster bei Reset ausgeloest
    socket.on('resetClients',function(){
       hidden1.setAttribute("value",nr);
        formReset.submit();
    });
    // Loest Ueberpruefung von aktueller Antwort aus
    socket.on('answerShow',function(data){
        checkAnswer(data);
        console.log("answer SHow aufgerufen");
    });


    // Zeigt aktuelle Spieler an
    function showPlayer(player){
        var div = document.createElement("element");
        div.className = "player";
        div.id = player;
        div.innerHTML = player ;
        p.appendChild(div);
    }
    // Ueberprueft die aktuelle Antwort und laesst die richtige Antwort aufblinken
    var checkAnswer = function(answer){
        if(A.innerHTML == answer){
            mA.className += " blinkA";


        }else if (B.innerHTML == answer){
            mB.className += " blinkB";


           // A.innerHTML = " ";
           // C.innerHTML = " ";
           // D.innerHTML = " ";
        }else if (C.innerHTML == answer){
            mC.className += " blinkC";
            //A.innerHTML = " ";
            //B.innerHTML = " ";
            //D.innerHTML = " ";
        }else if (D.innerHTML == answer) {
            mD.className += " blinkD";
            //A.innerHTML = " ";
            //B.innerHTML = " ";
            //C.innerHTML = " ";

        }
    }
    // Anpassung der Styles fuer desktop
    function changeStyles(){
        var width = window.innerWidth;
        if(width > 768){
            var logo = document.getElementById("logo");
            logo.firstChild.style.width = "70px";
            logo.firstChild.style.height = "70px";

        }
    }
    $(document).ready(function(){
        changeStyles();
    });

}
