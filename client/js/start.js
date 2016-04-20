function start(){
    var socket = io();
    var id = document.getElementById("id");
    socket.emit("ready");
    socket.on('id',function(data){
        id.innerHTML = "ID: " + data;
    });


}