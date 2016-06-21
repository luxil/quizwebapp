function start(){
    var socket = io();
    // Selectoren
    var id = document.getElementById("id");
    var hidden = document.getElementById("hidden");
    var form = document.getElementById("form");
    var socketID = document.getElementById("socketID");

    // Tested ob eine ID in dem hidden Feld eingetragen wurde
    var reseted = false;
    if(socketID.innerHTML != null && socketID.innerHTML != undefined && socketID.innerHTML != ""){
        reseted = true;
    }
    // Sendet Bereitschaftssignal und erhaelt eine id
    // falls im hidden Feld eine ID vermerkt ist wird diese mit der alten ueberschrieben
    socket.emit("ready");
    socket.on('id',function(data){
        id.innerHTML = "ID: " + data;
        hidden.setAttribute("value",data);
        if(reseted){
            socket.emit('idUpdate',[socketID.innerHTML,data]);
        }
    });
    // wird aufgerufen wenn Verbindung hergestellt wurde von Quizmaster
    socket.on('connectionEstablished',function(){
        console.log("Connection established");
        $("form").submit();
    });
    // Anpassungen fuer Desktop
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
}