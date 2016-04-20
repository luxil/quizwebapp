
function quiz (){
    var socket = io();
    var goButton = document.getElementById("go");
    var qty = document.getElementById("qty");
    var id = document.getElementById("id");
    var connect = document.getElementById("connect");

    goButton.addEventListener("click",startQuiz);
    connect.addEventListener("click",initialize);

    function initialize(){
        if(id.value != null || id.value != "undefined"){
            var connector = id.value;
            socket.emit('initialize',connector);
        }
    }

    function startQuiz(){
        var anzahl = qty.value;
        console.log(anzahl);
        if (parseInt(anzahl)< 9) {
            //socket.emit('startQuiz', anzahl);
            socket.emit('getQuestions', anzahl);
            socket.on('startQuiz', function(data){
                socket.emit('startQuiz in index', data);
            });

            goButton.style.visibility = "hidden";
        }
        else {
            alert("Zuviele Fragen ausgewaehlt! Maximum = 8");
        }
    }
}