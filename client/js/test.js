function test(){
    // Selectoren
    var idInput = document.getElementById("id");
    var button1 = document.getElementById("1");
    var button2 = document.getElementById("2");
    var button3 = document.getElementById("3");
    var button4 = document.getElementById("4");
    var button5 = document.getElementById("5");
    var button6 = document.getElementById("6");
    var button7 = document.getElementById("7");
    var button8 = document.getElementById("8");
    var button9 = document.getElementById("9");
    var button10 = document.getElementById("0");
    var buttonc = document.getElementById("c");
    var buttoncall = document.getElementById("call");
    var connectButton = document.getElementById("connect");
    var changeCatButton = document.getElementById("changeCat");
    var table = document.getElementById("table");
    var addQuestionButton = document.getElementById("addQuestionButton");
    var go = document.getElementById("go");



    //ContentSelector
    var inputSection = document.getElementById("inputSection");
    var questionSection = document.getElementById("questionSection");
    var fragenSelector = document.getElementById("fragen");
    var fragenAnzeige = document.getElementById("fragenAnzeige");
    var questionShowSectionSelector = document.getElementById("questionShowSection");
    var questionAddSelector = document.getElementById("questionAddSection");
    var addAnzeige = document.getElementById("addAnzeige");
    var bottomSelector = document.getElementById("bottom");
    var counter = 0;
    //var counterCat = 0;
    var currentCatalog = 0;

    var daten;
    var raum;
    var fragen;
    var cats;
    var firstConnect = true;
    var tempCatID = 10000;

    button1.addEventListener("click",addDigit);
    button2.addEventListener("click",addDigit);
    button3.addEventListener("click",addDigit);
    button4.addEventListener("click",addDigit);
    button5.addEventListener("click",addDigit);
    button6.addEventListener("click",addDigit);
    button7.addEventListener("click",addDigit);
    button8.addEventListener("click",addDigit);
    button9.addEventListener("click",addDigit);
    button10.addEventListener("click",addDigit);
    buttonc.addEventListener("click",addDigit);
    buttoncall.addEventListener("click",addDigit);
    addQuestionButton.addEventListener("click",showAddSection);

    connectButton.addEventListener("click",initialize);
    changeCatButton.addEventListener("click", changeCatAction)
    var socket = io();
    socket.emit('getCats');
    socket.emit('getQuestions', {room: id.value, catID: tempCatID}); //////hier �ndern!!!!!! //AAA

    // Hier wird der Input der Eingabebuttons auf das id input feld uebergeben.
    function addDigit(event){
        var source = event.target || event.srcElement;
        var id = source.id;
        if(id == "1"){
            idInput.value += "1";
        }else if(id == "2"){
            idInput.value += "2";
        }else if(id == "3"){
            idInput.value += "3";
        }else if(id == "4"){
            idInput.value += "4";
        }else if(id == "5"){
            idInput.value += "5";
        }else if(id == "6"){
            idInput.value += "6";
        }else if(id == "7"){
            idInput.value += "7";
        }else if(id == "8"){
            idInput.value += "8";
        }else if(id == "9"){
            idInput.value += "9";
        }else if(id == "0"){
            idInput.value += "0";
        }else if(id == "c"){
            var len = idInput.value.length;
            console.log(len);
            if(len > 0){

                idInput.value= idInput.value.slice(0,-1);
            }
        }else if(id == "call"){
            idInput.value ="";
            idInput.setAttribute("placeholder","Screen ID eingeben");
        }
    }
    //Hier wird der Frageneingabe Bereich angezeigt
    function showAddSection(){
        $(addAnzeige).empty();
        questionSection.style.height = "0px";
        questionSection.style.display = "none";
        questionAddSelector.style.display = "inline";
        bottomSelector.style.height = "0px";
        bottomSelector.style.display = "none";

        var fragenItem = document.createElement("p");
        fragenItem.innerHTML = "Frage:";
        addAnzeige.appendChild(fragenItem);
        var fragenInputItem = document.createElement("p");
        addAnzeige.appendChild(fragenInputItem);
        var fragenInput = document.createElement("input");
        fragenInput.id = "f";
        fragenInput.className = "f";
        //fragenInput.setAttribute("value","Frage");
        fragenInputItem.appendChild(fragenInput);

        var antwortItem = document.createElement("p");
        antwortItem.innerHTML = "Antwort";
        addAnzeige.appendChild(antwortItem);
        var antwortInputItem = document.createElement("p");
        addAnzeige.appendChild(antwortInputItem);
        var antwortInput = document.createElement("input");
        antwortInput.id = "a";
        antwortInput.className = "a";
        //antwortInput.setAttribute("value","Antwort");
        antwortInputItem.appendChild(antwortInput);

        var wrongItem1 = document.createElement("p");
        wrongItem1.innerHTML = "Falsch";
        addAnzeige.appendChild(wrongItem1);
        var wrongInputItem1 = document.createElement("p");
        addAnzeige.appendChild(wrongInputItem1);
        var wrongInput1 = document.createElement("input");
        wrongInput1.id = "w1";
        wrongInput1.className = "w1";
        //wrongInput1.setAttribute("value","Falsche Antwort 1");
        wrongInputItem1.appendChild(wrongInput1);

        var wrongItem2 = document.createElement("p");
        wrongItem2.innerHTML = "Falsch2";
        addAnzeige.appendChild(wrongItem2);
        var wrongInputItem2 = document.createElement("p");
        addAnzeige.appendChild(wrongInputItem2);
        var wrongInput2 = document.createElement("input");
        wrongInput2.id = "w2";
        wrongInput2.className = "w2";
        //wrongInput2.setAttribute("value","Falsche Antwort 2");
        wrongInputItem2.appendChild(wrongInput2);

        var wrongItem3 = document.createElement("p");
        wrongItem3.innerHTML = "Falsch3";
        addAnzeige.appendChild(wrongItem3);
        var wrongInputItem3 = document.createElement("p");
        addAnzeige.appendChild(wrongInputItem3);
        var wrongInput3 = document.createElement("input");
        wrongInput3.id = "w3";
        wrongInput3.className = "w3";
        //wrongInput3.setAttribute("value","Falsche Antwort 3");
        wrongInputItem3.appendChild(wrongInput3);

        var button = document.createElement("button");
        button.innerHTML = "Abbrechen";
        addReturn(button);
        addAnzeige.appendChild(button);
        var button2 = document.createElement("button");
        button2.innerHTML = "Hinzuf&uuml;gen";
        addAdd(button2);
        addAnzeige.appendChild(button2);
    }
    //Diese Funktion wird aufgerufen wenn der go Button gedrueckt wird
    //Je nach Inhalt wird eine andere Funktion ausgefuehrt
    function goQuiz(){
        //console.log("Quiz started");
        var testValue = go.innerHTML;
        if(testValue == "Start Quiz"){
            startQuiz();
        }else if(testValue == "Reset"){
            reset();
        }else{
            //
        }
    }
    //Reset setzt alle Anzeigen auf den Startzustand
    //An alle Clienten wird ein Reset event gesendet.
    function reset(){
        socket.emit('reset',idInput.value);
        //questionShowSectionSelector.style.height = "0px";
        questionSection.style.display = "none";
        questionShowSectionSelector.style.display = "none";
        questionAddSelector.style.display = "none";
        bottomSelector.style.display = "none";
        inputSection.style.display = "inline";
        idInput.value="";
        connectButton.disabled = false;
        changeCatButton.style.display = "none";
        go.innerHTML="Waiting for Players";

    }
    //Hier wird die Ansicht auf die normale Fragenuebersicht geaendert
    function showThisQuestion(){
        //questionShowSectionSelector.style.height = "0px";
        questionShowSectionSelector.style.display = "none";
        questionAddSelector.style.display = "none";
        questionSection.style.height = "60%";
        questionSection.style.display = "inline-block";
        bottomSelector.style.height ="30%";
        bottomSelector.style.display = "block";


    }
    //Hier wird eine aktuell eingegebene Frage zur Uebersicht hinzugefuegt und
    //den lokalen Fragen hinzugefuegt
    function addToQuestions(f,a,f1,f2,f3){
        if(f.indexOf('<') === -1 && a.indexOf('<') === -1 && f1.indexOf('<') === -1 && f2.indexOf('<') === -1 && f3.indexOf('<') === -1 ){
            var el = document.createElement("tr");
            el.className = "questions";
            el.id = "frage"+counter;
            fragenSelector.appendChild(el);
            var button = document.createElement("td");
            button.className = "questionToggleOn";
            button.innerHTML = "+";
            button.id ="button" + counter;
            el.appendChild(button);
            var fragenItem = document.createElement("td");
            fragenItem.innerHTML = f;
            fragenItem.className = ("question");
            fragenItem.id = "q"+counter;
            el.appendChild(fragenItem);

            addToggle(button);
            addShowQuestion(fragenItem);

            counter++;

            fragen.push([counter,f,a,f1,f2,f3,a]);
            console.log(fragen);
        }
    }
    //Hier wird die Aktuelle Frage Eingabe ueberprueft und gegebenfalls hinzugefuegt
    function addThisQuestion(){
        var f = document.getElementById("f");
        var a = document.getElementById("a");
        var w1 = document.getElementById("w1");
        var w2 = document.getElementById("w2");
        var w3 = document.getElementById("w3");
        if(f.value != "" && f.value != undefined && f.value[0] != "<" &&
             a.value != "" && a.value != undefined &&
             w1.value != "" && w1.value != undefined &&
             w2.value != "" && w2.value != undefined
             && w3.value != "" && w3.value != undefined ){
            addToQuestions(f.value,a.value,w1.value,w2.value,w3.value);
            f.value = "";
            a.value = "";
            w1.value = "";
            w2.value = "";
            w3.value = "";
            showThisQuestion();
        }
    }
    // Eventhandler fuer einzelne dynamische ELemente
    function addAdd(c){
        $(c).on("click",function(){addThisQuestion();});
    }
    function addReturn(c){
        $(c).on("click",function(){showThisQuestion();});
    }
    // Hier wird die Anzeige fuer eine ausgewaehlte Frage generiert
    function showQuestionSection(array){
        $(fragenAnzeige).empty();
        questionSection.style.height = "0px";
        questionSection.style.display = "none";
        questionShowSectionSelector.style.display = "inline";
        bottomSelector.style.height = "0px";
        bottomSelector.style.display = "none";
        var fragenItem = document.createElement("p");
        fragenItem.innerHTML = array[1];

        fragenAnzeige.appendChild(fragenItem);
        var antwortItem = document.createElement("p");
        antwortItem.className = "antwortAnzeige";
        antwortItem.innerHTML = array[2];
        fragenAnzeige.appendChild(antwortItem);
        var wrongs = document.createElement("p");
        wrongs.className = "allWrongAnzeige";
        fragenAnzeige.appendChild(wrongs);
        var wrong1 = document.createElement("element");
        wrong1.className = "wrongAnzeige";
        wrong1.innerHTML = array [3] + ",";
        wrongs.appendChild(wrong1);
        var wrong2 = document.createElement("element");
        wrong2.className = "wrongAnzeige";
        wrong2.innerHTML = array [4] + ",";
        wrongs.appendChild(wrong2);
        var wrong3 = document.createElement("element");
        wrong3.className = "wrongAnzeige";
        wrong3.innerHTML = array [5];
        wrongs.appendChild(wrong3);
        var button = document.createElement("button");
        button.innerHTML = "Ok";
        addReturn(button);
        fragenAnzeige.appendChild(button);


    }
    // Eventhandler fuer einzelne dynamische Elemente
    function showQuestion(c){
        var i = c.toString().slice(1);
        showQuestionSection(fragen[i]);
    }
    // Veraendert den Zustand der Frage in + und -
    // ueber questionToggleOn werden ausgewaehlte Elemente
    // erkannt.
    function toggleAdd(c){
        var item = document.getElementById(c);
        if(item.className === "questionToggleOn"){
            item.className = "questionToggleOff";
            item.innerHTML = "-";
        }else{
            item.className = "questionToggleOn";
            item.innerHTML = "+";
        }
    }
    function addToggle(c){
        $(c).on("click",function(){toggleAdd(c.id);});
    }
    function addShowQuestion(c){
        $(c).on("click",function(){showQuestion(c.id);});
    }
    // Erstellen der Fragenuebersichtsanzeige einmalig
    function listQuestions(array){
        var el = document.createElement("tr");
        el.className = "questions";
        el.id = "frage"+counter;
        fragenSelector.appendChild(el);
        var button = document.createElement("td");
        button.className = "questionToggleOn";
        button.innerHTML = "+";
        button.id ="button" + counter;
        el.appendChild(button);
        var fragenItem = document.createElement("td");
        fragenItem.innerHTML = array[1];
        fragenItem.className = ("question");
        fragenItem.id = "q"+counter;
        el.appendChild(fragenItem);

        addToggle(button);
        addShowQuestion(fragenItem);

        counter++;
    }
    // Wenn eine Id eingegeben wurde und der Button gedrueckt wurde
    function initialize(){
        if(idInput.value != null || idInput.value != "undefined"){
            var connector = idInput.value;
            //Dem Server wird ein Verbindungsversuch fuer die ausgewaehlte
            //ID mitgeteilt
            socket.emit('initialize',connector);

            connectButton.disabled = true;
        }
    }

    function listCats(array){
        var button = document.createElement("button");
        button.id = "cat"+array[0];
        button.innerHTML = array[1];
        addAnzeige.appendChild(button);
        changeTempCatID(button);
        //counterCat++;
        /////
        //fragenItem.className = ("question");
        //addShowQuestion(fragenItem);
    }
    function changeCatAction(){             ////AAA
        console.log("changeCatAction");
        questionSection.style.height = "0px";
        questionSection.style.display = "none";
        questionAddSelector.style.display = "inline";
        bottomSelector.style.height = "0px";
        bottomSelector.style.display = "none";
        $(addAnzeige).empty();
        cats.forEach(listCats);
        var button3 = document.createElement("button");
        button3.innerHTML = "Ok";
        addAnzeige.appendChild(button3);
        addReturn(button3);

    }

    function catClicked(id){
        //console.log("id bei catClicked:" + id);
        for (var i = 0; i < 50; i++){
            if ("cat"+ i.toString() === id){
                tempCatID = i;
            }
        }
        console.log(tempCatID);

        socket.emit('getQuestions', {room: id.value, catID: tempCatID});

        //showQuestionSection();
    }
    function changeTempCatID(c){
        $(c).on("click",function(){catClicked(c.id), showThisQuestion});
    }
    // Der Server sendet das eine falsche ID eingegeben wurde
    socket.on('wrongID',function(){
        idInput.value = "";
        connectButton.disabled = false;
    });
    // Der Server sendet das eine correcte ID eingegeben wurde
    // Input wird ausgeblendet, Fragen und Bottom werden angezeigt
    socket.on('test',function(){
        console.log("Connection established");
        inputSection.style.height = "0 px";
        inputSection.style.display = "none";
        changeCatButton.style.display = "block";
        /*Linh: Ist das wirklich n�tig?
        if(firstConnect){
            fragen.forEach(listQuestions);
            firstConnect = false;
        }
        */

        questionSection.style.display = "inline-block";
        bottomSelector.style.display = "block";

        go.addEventListener("click",goQuiz);


    });
    // Hier erhaelt der Client die Fragen und speichert sie lokal.
    socket.on('showQuestions', function(data){
        //counter = 0;
        daten = data;
        raum = data.raum;
        fragen = data.allQuestions;
        //socket.emit('updateQuestionsByCat');
        $(fragenSelector).empty();
        fragen.forEach(listQuestions);
        console.log("Fragen:" + fragen);
    });
    //AAA
    socket.on('updateQuestionsByCat', function(){
        $(fragenSelector).empty();
        fragen.forEach(listQuestions);
        //showThisQuestion();
        console.log("hier sind die Fragen " + fragen);
        showQuestionSection(fragen);
    });
    socket.on('tempCatNamesAndIDs', function(data){
        //counter = 0;
        cats = data.allCats;
        console.log(cats);
    });
    // Nach einem reset erhaelt der client die neue ID des alten Monitors
    socket.on('updateID',function(data){
        idInput.value = data;
    });
    // Wenn ein Spieler joined/leaved
    socket.on('playerUpdate',function(data){
        console.log(data);
        //$(p).empty();
        var len = data.length;
        var count = document.getElementById("playercount");
        count.innerHTML = len;
        if(go.innerHTML == "Reset"){

        }else{
            if (len >= 1){
                go.innerHTML = "Start Quiz";
            }else {
                go.innerHTML = "Waiting for Players";
            }
        }

    });
    function startQuiz(){
        var sendArray = [];
        var notPicked = [];
        var questionCatalog = [];

        $('td').each(function (){
            this.className == "questionToggleOn" ? sendArray.push(this.id.slice(6)) : notPicked.push(this.id.slice(5));
        })
        console.log(sendArray);
        console.log(notPicked);
        var len = sendArray.length;
        for(var i = 0;i<len;i++){
            questionCatalog.push([i,fragen[sendArray[i]][1],fragen[sendArray[i]][2],fragen[sendArray[i]][3],fragen[sendArray[i]][4],fragen[sendArray[i]][5],fragen[sendArray[i]][2]]);
        }

        var value = idInput.value;
        socket.emit('startQuiz in index', [value,questionCatalog]);
        go.innerHTML = "Reset";
    }
/*
     function resize () {
        if (window.orientation == -90) {
            document.getElementById('test').className = 'orientright';
            //alert(document.getElementById('orient').className);
        }
        if (window.orientation == 90) {
            document.getElementById('test').className = 'orientleft';
        }
        if (window.orientation == 0) {
            document.getElementById('test').className = '';
        }
    };*/


        screen.orientation.lock('portrait').catch(function() {
            console.log('not chrome');
        });
    /*
    window.addEventListener('orientationchange', resize, false);
    //window.addEventListener('resize', resize, false);
    */
}