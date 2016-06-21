// Globale Variable fuer Zugriff von aussen
var aktuelleFrage;

exports.getFrage = function(){
  return aktuelleFrage;
};
exports.init = function(fragen,room,io){

  var raum = room;


  this.getFrage = function(){
    return aktuelleFrage;
  };
  // Timer Wert
  var timer = 15;
  // Timer Uebergangswert
  var timer2 = 4;

  // Array fuer die aktuellen Fragen
  var Fragen = [];
  var anzahl = fragen.length;

  // Hier werden die erhaltenen "fragen" randomisiert und zu "Fragen" hinzugefuegt
  for ( var i = 0 ; i < anzahl; i++){
    var frage=[];
    var random= [];

    frage.push(fragen[i][1]);

    random.push(fragen[i][2],fragen[i][3],fragen[i][4],fragen[i][5]);

    shuffle(random);
    for (var k = 0;k<4;k++){
      frage[k+1]=random[k];
    }
    


    frage.push(fragen[i][2]);





    Fragen.push(frage);

  }
  // Funktionen um Events an die Clienten zu senden
  function showTimer(){
    io.sockets.in(raum).emit('timerUpdate',counter);
  };
  function showQuestion(){
    io.sockets.in(raum).emit('questionUpdate',aktuelleFrage);
  };
  function showScore(){
    io.sockets.in(raum).emit('updateScore');
  };
  function getAnswer(){
    io.sockets.in(raum).emit('answerUpdate');
  }
  function showAnswer(){
    io.sockets.in(raum).emit('answerShow',aktuelleFrage[5]);
  }




  // Hilfsvariablen fuer Logik
  var pause = false;

  var counter = timer;
  var counter2 = timer2;
  var counter3 = 0;
  // Diese Logik wird jede Sekunde ausgefuert und ueberprueft den aktuellen Stand
  // der Timer Wert wird jedes mal um 1 verringert und wird bei 0 mit einer
  // neuen Frage befuellt, sofern diese vorhanden ist, ansonsten wird das Ende mitgeteilt.
  function logic(){

    if (counter == timer && pause == false){

      anzahl -= 1;

      aktuelleFrage = Fragen.pop();
      showQuestion();

    }
    if (counter <= 0 && pause == false){

      showTimer();

      getAnswer();

      pause = true;
      if (anzahl == 0){

        counter3++;
        if(counter3 == 2){
        clearInterval(interval);
        console.log("Quiz " + raum + " beendet");

        showScore();
        }

      }else{
      counter = timer;
      }
    }else if(pause == false){

      showTimer();
      counter -= 1;
    }
    else if (pause == true){
      if(counter2 <= 0){
        pause = false;

        counter2 = timer2;
      }else if(counter2 == timer2){
        showAnswer();
        counter2 -= 1;
      }else{
        counter2 -=1;
      }

    }
  };
  var interval = setInterval(logic,1000);

  // Funktion fuer einen Shuffle
  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    while (0 !== currentIndex) {

      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

};