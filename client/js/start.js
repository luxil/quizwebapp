function start(){
    var socket = io();
    var id = document.getElementById("id");
    var hidden = document.getElementById("hidden");
    var form = document.getElementById("form");
    var socketID = document.getElementById("socketID");
    var reseted = false;
    if(socketID.innerHTML != null && socketID.innerHTML != undefined && socketID.innerHTML != ""){
        reseted = true;
    }

    socket.emit("ready");
    socket.on('id',function(data){
        id.innerHTML = "ID: " + data;
        hidden.setAttribute("value",data);
        if(reseted){
            console.log("hier wird reseted " + socketID.innerHTML);
            socket.emit('idUpdate',[socketID.innerHTML,data]);
        }
    });
    socket.on('connectionEstablished',function(){
        console.log("Connection established");
        $("form").submit();
    });
    function changeStyles(){
        var width = window.innerWidth;
        if(width > 768){
            var logo = document.getElementById("logo");
            logo.firstChild.style.width = "70px";
            logo.firstChild.style.height = "70px";
        }
        //alert(width);
    }
    $(document).ready(function(){
       changeStyles();
    });
}