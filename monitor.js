function monitor(){
    var socket = io();

    var timer = document.getElementById("timer");
    var question = document.getElementById("question");
    var A = document.getElementById("A");
    var B = document.getElementById("B");
    var C = document.getElementById("C");
    var D = document.getElementById("D");

    socket.on('timerUpdate',function(data){

       timer.innerHTML = "<h3>"+ data + "</h3>";
    });
    socket.on('questionUpdate',function(data){
       question.innerHTML = data[0];
        A.innerHTML = data[1];
        B.innerHTML = data[2];
        C.innerHTML = data[3];
        D.innerHTML = data[4];
    });

}
