function monitor(){
    var socket = io();

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

    var test;

    socket.on('timerUpdate',function(data){

       timer.innerHTML = "<h3>"+ data + "</h3>";
    });
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

        test = data[5];

    });

    socket.on('updateScore',function(){
        window.location.replace("/success");
    });

    socket.on('answerShow',function(data){
        checkAnswer(data);
        console.log("answer SHow aufgerufen");
    });



    var checkAnswer = function(answer){
        if (test == answer){
            console.log("antwort korrekt uebermittelt");
        }
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
}
