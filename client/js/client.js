function client(){
    //var user = prompt("Bitte gib deinen Usernamen ein:");
    var nick = document.getElementById("user");
    var raum = document.getElementById("nr");
    var form = document.getElementById("form");
    var hidden = document.getElementById("hidden");
    var nr = raum.innerHTML;
    var user = nick.innerHTML;
    var socket = io();


        var nummer=parseInt(nr);
        var data=[user,nummer];
        console.log(data);
       socket.emit('addPlayer',data);

    var currentPickedAnswer;
    var score = 0;


    var a = document.getElementById("a");
    var b = document.getElementById("b");
    var c = document.getElementById("c");
    var d = document.getElementById("d");



    var scoreLabel = document.getElementById("score");

    function resetAnswer(){
        currentPickedAnswer = "0";
        a.style.backgroundColor = "#DFF0D8";
        b.style.backgroundColor = "#D9EDF7";
        c.style.backgroundColor = "#FCF8E3";
        d.style.backgroundColor = "#F2DEDE";

    }

    function changeAnswer(event){
        resetAnswer();
        var source = event.srcElement || event.target;
        //console.log(source);
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





    socket.on('answerUpdate',function(){
        socket.emit('answer',currentPickedAnswer);
        resetAnswer();
    });
    socket.on('updateScore',function(data){
        if(data != undefined){
            score = data;
            scoreLabel.innerHTML =  score + " Punkte";
        }
    });
    socket.on('resetClients',function(){
        hidden.setAttribute("value",user);
        console.log(hidden);
        $("form").submit();
    });
    function changeStyles(){
        var width = window.innerWidth;
        if(width > 768){
            var us = document.getElementById("user");
            us.style.fontSize = "20px";
            var ra = document.getElementById("raum");
            ra.style.fontSize = "20px";
            var sc = document.getElementById("score");
            sc.style.fontSize = "20px";


        }
        //alert(width);
    }
    $(document).ready(function(){
        changeStyles();
    });
    a.addEventListener("click",changeAnswer);
    b.addEventListener("click",changeAnswer);
    c.addEventListener("click",changeAnswer);
    d.addEventListener("click",changeAnswer);
}