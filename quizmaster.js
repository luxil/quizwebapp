
function quiz (){
    var socket = io();
    var goButton = document.getElementById("go");
    var qty = document.getElementById("qty");

    goButton.addEventListener("click",startQuiz);

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