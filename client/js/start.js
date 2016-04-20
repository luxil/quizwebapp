function start(){
    var socket = io();
    var id = document.getElementById("id");
    var hidden = document.getElementById("hidden");
    var form = document.getElementById("form");

    socket.emit("ready");
    socket.on('id',function(data){
        id.innerHTML = "ID: " + data;
        hidden.setAttribute("value",data);
    });
    socket.on('connectionEstablished',function(){
        console.log("Connection established");
        $("form").submit();
    });

}