function quiz (){
    var socket = io();



     var goButton = document.getElementById("go");
    goButton.addEventListener("click",startQuiz);

    function startQuiz(){
        socket.emit('startQuiz');
    }
}