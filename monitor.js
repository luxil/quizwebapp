function monitor(){
    var socket = io();

    var timer = document.getElementById("timer");
    var question = document.getElementById("question");
    var A = document.getElementById("A");
    var B = document.getElementById("B");
    var C = document.getElementById("C");
    var D = document.getElementById("D");

    var test;

    socket.on('timerUpdate',function(data){

       timer.innerHTML = "<h3>"+ data + "</h3>";
    });
    socket.on('questionUpdate',function(data){
       question.innerHTML = data[0];
        A.innerHTML = data[1];
        B.innerHTML = data[2];
        C.innerHTML = data[3];
        D.innerHTML = data[4];

        test = data[5];
    });

    socket.on('updateScore',function(){
        window.location.replace("/success");
    });

    socket.on('answerShow',function(data){
        checkAnswer(data);
        console.log("answer SHow aufgerufen");
    });

    var toggled = true;
    function aFunction(){
        console.log("aFunction");
        if(toggled){
            A.backgroundColor = "red";
            toggled = false;
        }else{
            A.backgroundColor = "#DFF0D8";
            toggled = true;
        }
    }
    function bFunction(){
        console.log("bFunction");
        if(toggled){
            A.backgroundColor = "red";
            toggled = false;
        }else{
            A.backgroundColor = "#D9EDF7";
            toggled = true;
        }
    }
    function cFunction(){
        console.log("cFunction");
        if(toggled){
            A.backgroundColor = "red";
            toggled = false;
        }else{
            A.backgroundColor = "#FCF8E3";
            toggled = true;
        }
    }
    function dFunction(){
        console.log("dFunction");
        if(toggled){
            A.backgroundColor = "red";
            toggled = false;
        }else{
            A.backgroundColor = "#F2DEDE";
            toggled = true;
        }
    }

    var checkAnswer = function(answer){
        if (test == answer){
            console.log("antwort korrekt uebermittelt");
        }
        if(A.innerHTML == answer){

            var aInterval = setInterval(aFunction,500);
            //setTimeout(clearInterval(aInterval),3000);

        }else if (B.innerHTML == answer){



           // A.innerHTML = " ";
           // C.innerHTML = " ";
           // D.innerHTML = " ";
        }else if (C.innerHTML == answer){

            //A.innerHTML = " ";
            //B.innerHTML = " ";
            //D.innerHTML = " ";
        }else if (D.innerHTML == answer) {

            //A.innerHTML = " ";
            //B.innerHTML = " ";
            //C.innerHTML = " ";

        }
    }
}
