var io;

exports.init = function(fragen,nio){
  io = nio;
  var aktuelleFrage;
  var timer = 15;
  // Fragen vorbereiten

  var Fragen = [];

  var sammlung = fragen.toString().split(",");
  var anzahl = sammlung.length / 5;

  for ( var i = 0;i < anzahl; i++){
    var frage=[];
    var random=[];
    for (var j = 0;j < 5;j++){
      frage.push(sammlung.shift());
    }
    //Letztes Element ist die richtige Antwort
    frage.push(frage[1]);

    //Shuffle der Antwortmöglichkeiten
    random.push(frage[1],frage[2],frage[3],frage[4]);
    shuffle(random);
    for (var k = 0;k<4;k++){
      frage[k+1]=random[k];
    }
    Fragen.push(frage);
  }

  // Timer Funktionalität
  function showTimer(){
    io.sockets.emit('timerUpdate',counter);
  };
  function showQuestion(){
    io.sockets.emit('questionUpdate',aktuelleFrage);
  };
  function showScore(){
    io.sockets.emit('updateScore');
  };

  console.log(Fragen);


  // Logik starten


  var counter = timer;
  function logic(){

    if (counter == timer){
      console.log("Hier wird die Frage gepickt.");
      anzahl -= 1;
      // Momentan nur anzeigen und löschen der Frage
      aktuelleFrage = Fragen.pop();
      showQuestion();
      console.log(aktuelleFrage);
    }
    if (counter <= 0){
      console.log(counter);
      showTimer();
      console.log("Jetzt werden Antworten ausgewertet und Punkte vergeben.");
      // Hier kommt ein Even um die aktuelle Antwort auszuwerten
      counter = timer;
      if (anzahl == 0){
        clearInterval(interval);
        console.log("Quiz beendet");

        showScore();
        // Hier kommt ein Event um display auf scoreboard zu switchen
      }
    }else{
      console.log(counter);
      showTimer();
      counter -= 1;
    }
  };
  var interval = setInterval(logic,1000);


  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

};