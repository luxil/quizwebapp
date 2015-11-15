function client(){
    var user = prompt("Bitte gib deinen Usernamen ein:");
    var socket = io();

    socket.on('connect',function(){
       socket.emit('addPlayer',user);
    });


    var currentPickedAnswer;
    var score = 0;


    var a = document.getElementById("a");
    var b = document.getElementById("b");
    var c = document.getElementById("c");
    var d = document.getElementById("d");

    var userLabel = document.getElementById("user");
    var h3 = document.createElement("h3");
    h3.innerHTML = user;
    userLabel.appendChild(h3);

    var scoreLabel = document.getElementById("score");

    a.addEventListener("click",changeAnswer);
    b.addEventListener("click",changeAnswer);
    c.addEventListener("click",changeAnswer);
    d.addEventListener("click",changeAnswer);

    function changeAnswer(event){
        var source = event.srcElement;
        switch (source){
            case a:
                currentPickedAnswer = 1;
                console.log("a");
                break;
            case b:
                currentPickedAnswer = 2;
                console.log("b");
                break;
            case c:
                currentPickedAnswer = 3;
                console.log("c");
                break;
            case d:
                currentPickedAnswer = 4;
                console.log("d");
                break;
        }

    }

    socket.on('connect',function(){user;});

    socket.on('answerUpdate',function(){
        socket.emit('answer',currentPickedAnswer);
    });
    socket.on('updateScore',function(data){

        score = data;
        scoreLabel.innerHTML = "<h3>" + score + " Punkte </h3>";
    });
}