//var io;
var aktuelleFrage;

exports.getFrage = function(){
  return aktuelleFrage;
};
exports.init = function(fragen,room,io){
 // io = nio;
  var raum = room;
  console.log(raum +  " ist der Raum ");

  this.getFrage = function(){
    return aktuelleFrage;
  };
  var timer = 15;
  var timer2 = 4;
  // Fragen vorbereiten

  var Fragen = [];

 // var sammlung = fragen.toString().split(",");

  var anzahl = fragen.length;
  //console.log(anzahl);
  //console.log(fragen);

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

    //console.log(frage);



    Fragen.push(frage);
   // console.log(Fragen);
  }

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

  console.log(Fragen);


  // Logik starten
  var pause = false;

  var counter = timer;
  var counter2 = timer2;
  var counter3 = 0;
  function logic(){

    if (counter == timer && pause == false){
      console.log("Hier wird die Frage gepickt.");
      anzahl -= 1;
      // Momentan nur anzeigen und l�schen der Frage
      aktuelleFrage = Fragen.pop();
      showQuestion();
      console.log(aktuelleFrage);
    }
    if (counter <= 0 && pause == false){
      console.log(counter);
      showTimer();
      console.log("Jetzt werden Antworten ausgewertet und Punkte vergeben.");
      getAnswer();
      // Hier kommt ein Event um die aktuelle Antwort auszuwerten
      pause = true;
      console.log("pause wurde true.");

      if (anzahl == 0){

        counter3++;
        if(counter3 == 2){
        clearInterval(interval);
        console.log("Quiz beendet");

        showScore();
        }

      }else{
      counter = timer;
      }
    }else if(pause == false){
      console.log(counter);
      showTimer();
      counter -= 1;
    }
    else if (pause == true){
      if(counter2 <= 0){
        pause = false;
        console.log("pause wurde gefalsed");
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