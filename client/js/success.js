function score(){
    // Selectoren
    var liste = document.getElementById("liste");
    var socket = io();
    var counter = 0;
    var id= document.getElementById("id");
    var formReset = document.getElementById("formReset");
    var hidden = document.getElementById("hidden");
    var nr = parseInt(id.innerHTML);

    // Gewinnerliste fuer den Raum wird erfragt
    socket.emit('getList',nr);

    // Handler fuer das Erhalten der Liste
    socket.on('getListSuccess',function(data){
        console.log("daten kamen" + data);
        data.forEach(createListItem);
    });
    // Wird durch Quizmaster ausgeloest
    socket.on('resetClients',function(){
        hidden.setAttribute("value",nr);
        formReset.submit();
    });
    // Generiert die Gewinnerliste
    function createListItem(data){
        var listItem = document.createElement('li');
        if(counter % 3 == 0 ){
            listItem.className = "list-group-item list-group-item-success";
        }else if(counter % 3 == 1 ){
            listItem.className = "list-group-item list-group-item-info";
        }else{
            listItem.className = "list-group-item list-group-item-warning";
        }
        listItem.innerHTML = data[0];
        var scoreItem = document.createElement('span');
        scoreItem.className = "badge";
        scoreItem.innerHTML = data[1];
        listItem.appendChild(scoreItem);
        liste.appendChild(listItem);

        counter ++;
    };
    // Anpassung fuer Desktops
    function changeStyles(){
        var width = window.innerWidth;
        if(width > 768){
            var logo = document.getElementById("logo");
            logo.firstChild.style.width = "70px";
            logo.firstChild.style.height = "70px";

        }
    }
    $(document).ready(function(){
        changeStyles();
    });

};