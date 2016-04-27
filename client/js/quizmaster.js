
function quiz (){
    var socket = io();
    var goButton = document.getElementById("go");
    var id = document.getElementById("id");
    var connect = document.getElementById("connect");
    var quiz = document.getElementById("quiz");
    var liste = document.getElementById("liste");
    var questionDiv = document.getElementById("questions");
    var add = document.getElementById("add");
    var playerDiv = document.getElementById("players");
    var p = document.getElementById("player");
    var reset = document.getElementById("reset");
    var fragen;
    var daten;
    var counter = 0;
    var raum;
    goButton.addEventListener("click",startQuiz);
    add.addEventListener("click",addFrage);
    reset.addEventListener("click",resetLocation);
    goButton.style.visibility = "hidden";
    questionDiv.style.visibility = "hidden";
    liste.style.visibility = "hidden";
    add.style.visibility = "hidden";
    playerDiv.style.visibility = "hidden";
    reset.style.visibility = "hidden";

    connect.addEventListener("click",initialize);

    socket.on('test',function(){
       console.log("Connection established");
        liste.style.visibility = "visible"
        questionDiv.style.visibility = "visible";
        add.style.visibility = "visible";
        playerDiv.style.visibility = "visible";
        reset.style.visibility ="visible";

    });
    socket.on('playerUpdate',function(data){
        console.log(data);
        $(p).empty();
       data.forEach(showPlayer);
        checkReady();
    });
    socket.emit('getQuestions', id.value);

    socket.on('wrongID',function(){
        id.value = "";
        connect.style.visibility = "visible";
    });


    socket.on('showQuestions', function(data){
        daten = data;
        raum = data.raum;
        fragen = data.allQuestions;
        //console.log(fragen);
        //showQuestions(fragen);
        fragen.forEach(showQuestions);

    });
    socket.on('updateID',function(data){
        console.log("hier kam die neue id "+ data);
        id.value = data;
    });
    function checkReady(){
        console.log("gecheckt");
        var count = p.childElementCount;
        console.log(count);
        if(count > 0){
            goButton.style.visibility = "visible";
        }else{
            goButton.style.visibility = "hidden";
        }
    }
    function showPlayer(player){
        var div = document.createElement("div");
        div.className = "player";
        div.id = player;
        div.innerHTML = player ;
        p.appendChild(div);
    }
    function addFrage(){
        var frage = document.getElementById("frage");
        var antwort = document.getElementById("antwort");
        var falsch1 = document.getElementById("falsch1");
        var falsch2 = document.getElementById("falsch2");
        var falsch3 = document.getElementById("falsch3");
        if(frage.value != "Frage" && frage.value != "" && frage.value != undefined && frage.value[0] != "<" &&
            antwort.value != "Antwort" && antwort.value != "" && antwort.value != undefined &&
            falsch1.value != "Falsche Antwort 1" && falsch1.value != "" && falsch1.value != undefined &&
            falsch2.value != "Falsche Antwort 2" && falsch2.value != "" && falsch2.value != undefined &&
            falsch3.value != "Falsche Antwort 3" && falsch3.value != "" && falsch3.value != undefined ){
            addToQuestions(frage.value,antwort.value,falsch1.value,falsch2.value,falsch3.value);
            frage.value = "Frage";
            antwort.value = "Antwort";
            falsch1.value = "Falsche Antwort 1";
            falsch2.value = "Falsche Antwort 2";
            falsch3.value = "Falsche Antwort 3";
        }
    }
    function addToQuestions(f,a,f1,f2,f3){
        if(f.indexOf('<') === -1 && a.indexOf('<') === -1 && f1.indexOf('<') === -1 && f2.indexOf('<') === -1 && f3.indexOf('<') === -1 ){
            var li = document.createElement("li");
            li.id = "list" + counter;
            liste.appendChild(li);
            var question = document.createElement("div");
            question.id = "question" + counter;
            question.className ="questions";
            question.innerHTML = f;
            li.appendChild(question);
            var answer = document.createElement("div");
            answer.id = "answer"+ counter;
            answer.className ="correct answers";
            answer.innerHTML = a;
            li.appendChild(answer);
            var wrong1 = document.createElement("div");
            wrong1.id = "wrong1"+counter;
            wrong1.className = "answers";
            wrong1.innerHTML = f1;
            li.appendChild(wrong1);
            var wrong2 = document.createElement("div");
            wrong2.id = "wrong2"+counter;
            wrong2.className = "answers";
            wrong2.innerHTML = f2;
            li.appendChild(wrong2);
            var wrong3 = document.createElement("div");
            wrong3.id = "wrong3"+counter;
            wrong3.className = "answers";
            wrong3.innerHTML = f3;
            li.appendChild(wrong3);
            var check = document.createElement("input");
            check.setAttribute("type","checkbox");
            check.setAttribute("form","startForm");
            check.id = "check"+counter;
            check.checked = "true";
            li.appendChild(check);
            counter++
        }
    }
    function showQuestions(array){
        var li = document.createElement("li");
        li.id = "list" + counter;
        liste.appendChild(li);
        var question = document.createElement("div");
        question.id = "question" + counter;
        question.className ="questions";
        question.innerHTML =array[1];
        li.appendChild(question);
        var answer = document.createElement("div");
        answer.id = "answer"+ counter;
        answer.className ="answers";
        answer.innerHTML = array[2];
        li.appendChild(answer);
        var wrong1 = document.createElement("div");
        wrong1.id = "wrong1"+counter;
        wrong1.className = "answers";
        wrong1.innerHTML = array[3];
        li.appendChild(wrong1);
        var wrong2 = document.createElement("div");
        wrong2.id = "wrong2"+counter;
        wrong2.className = "answers";
        wrong2.innerHTML = array[4];
        li.appendChild(wrong2);
        var wrong3 = document.createElement("div");
        wrong3.id = "wrong3"+counter;
        wrong3.className = "answers";
        wrong3.innerHTML = array[5];
        li.appendChild(wrong3);
        var check = document.createElement("input");
        check.setAttribute("type","checkbox");
        check.setAttribute("form","startForm");
        check.id = "check"+counter;
        check.checked = "true";
        li.appendChild(check);

        counter++;



    }

    function initialize(){
        if(id.value != null || id.value != "undefined"){
            var connector = id.value;
            socket.emit('initialize',connector);
            connect.style.visibility ="hidden";
        }
    }
    function resetLocation(){
        socket.emit('reset',id.value);
        connect.style.visibility ="visible";
        goButton.style.visibility = "hidden";
        questionDiv.style.visibility = "hidden";
        liste.style.visibility = "hidden";
        add.style.visibility = "hidden";
        playerDiv.style.visibility = "hidden";
        reset.style.visibility = "hidden";
        id.value="";


    }
    function startQuiz(){
        var sendArray = [];
        var notPicked = [];
        var questionCatalog = [];

        $('input[type=checkbox]').each(function (){
            this.checked ? sendArray.push(this.id.slice(5)) : notPicked.push(this.id.slice(5));
        })
        console.log(sendArray);
        var len = sendArray.length;
        for(var i = 0;i<len;i++){
            var question = document.getElementById("question"+sendArray[i]).innerHTML;
            var answer = document.getElementById("answer"+sendArray[i]).innerHTML;
            var wrong1 = document.getElementById("wrong1"+sendArray[i]).innerHTML;
            var wrong2 = document.getElementById("wrong2"+sendArray[i]).innerHTML;
            var wrong3 = document.getElementById("wrong3"+sendArray[i]).innerHTML;

            console.log(sendArray[i] + " so sieht das Array aus");
            questionCatalog.push([i,question,answer,wrong1,wrong2,wrong3,answer]);



        }

            var value = id.value;
            socket.emit('startQuiz in index', [value,questionCatalog]);


            goButton.style.visibility = "hidden";
            add.style.visibility = "hidden";

    }
}