function client(){
    var user = prompt("Bitte gib deinen Usernamen ein:");
    var socket = io();

    socket.on('connect',function(){
       socket.emit('addPlayer',user);
    });

    var currentRightAnswer;
    var currentPickedAnswer;
    var score = 0;
    var currentData= [];
    var start = false;

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
    function checkAnswer(){
        if(currentData[currentPickedAnswer]==currentRightAnswer){
            score += 100;
            scoreLabel.innerHTML = "<h3>" + score + " Punkte </h3>";

        }else{
           // scoreLabel.innerHTML = score + " Punkte";
        }
    }
    socket.on('connect',function(){user;});
    socket.on('questionUpdate',function(data){
        // function to check last questions result and add points accordingly
        if (start) {
            checkAnswer();
        }
        start = true;


        currentData = data;

        currentRightAnswer = data[5];


    });
    socket.on('updateScore',function(){
        checkAnswer();
        socket.emit('score',score);
    });
}