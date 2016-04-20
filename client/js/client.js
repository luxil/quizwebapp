function client(){
    var user = prompt("Bitte gib deinen Usernamen ein:");
    var raum = document.getElementById("raum");
    var nr = parseInt(raum.innerHTML);
    var socket = io();

    socket.on('connect',function(){
        var data=[user,nr];
        console.log(data);
       socket.emit('addPlayer',data);
    });
    var currentPickedAnswer;
    var score = 0;


    var a = document.getElementById("a");
    var b = document.getElementById("b");
    var c = document.getElementById("c");
    var d = document.getElementById("d");

    var userLabel = document.getElementById("user");
    var h3 = document.createElement("h2");
    h3.innerHTML = user;
    userLabel.appendChild(h3);

    var scoreLabel = document.getElementById("score");

    a.addEventListener("click",changeAnswer);
    b.addEventListener("click",changeAnswer);
    c.addEventListener("click",changeAnswer);
    d.addEventListener("click",changeAnswer);

    function changeAnswer(event){
        resetAnswer();
        var source = event.srcElement;
        switch (source){
            case a:
                currentPickedAnswer = 1;
                a.style.backgroundColor = "#5bb235" ;
                console.log("a");
                break;
            case b:
                currentPickedAnswer = 2;
                b.style.backgroundColor = "#358ab2" ;
                console.log("b");
                break;
            case c:
                currentPickedAnswer = 3;
                c.style.backgroundColor = "#e5c844";
                console.log("c");
                break;
            case d:
                currentPickedAnswer = 4;
                d.style.backgroundColor = "#b23535";
                console.log("d");
                break;
        }

    }

    function resetAnswer(){
        currentPickedAnswer = null;
        a.style.backgroundColor = "#DFF0D8";
        b.style.backgroundColor = "#D9EDF7";
        c.style.backgroundColor = "#FCF8E3";
        d.style.backgroundColor = "#F2DEDE";

    }



    socket.on('answerUpdate',function(){
        socket.emit('answer',currentPickedAnswer);
        resetAnswer();
    });
    socket.on('updateScore',function(data){

        score = data;
        scoreLabel.innerHTML = "<h2>" + score + " Punkte </h2> ";
    });
}