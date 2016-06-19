function lobby(){

    var socket = io();

    var form = document.getElementById("form");
    var hidden = document.getElementById("hidden");
    var liste = document.getElementById("liste");
    var nick = document.getElementById("nick");
    var lobby = document.getElementById("lobby");
    var nameButton = document.getElementById("nameButton");
    var reset = document.getElementById("resetName");

   // var hasReset = reset.innerHTML;
    console.log("hier: " +reset.innerHTML);
    if(reset.innerHTML != null && reset.innerHTML != undefined && reset.innerHTML != ""){
        nick.value = reset.innerHTML;
        named();
    }
    // nameButton.style.visibility = "hidden";
    // $(nick).bind('input',function(){
    //     nameButton.style.visibility = "visible";
    // });

    $('.noEnterSubmit').keypress(function(e){
        if ( e.which == 13 ) e.preventDefault();
    });

    nameButton.addEventListener("click",named);

    socket.emit('getUpdate', 'getUpdateSuccess', function(array){
        console.log(array);
        $(liste).empty();
        array.forEach(createListItem);
        var test = liste.firstChild;
        console.log(test + " das FirstChild");
        if(test == undefined || test == null){
            var status = document.createElement("element");
            status.id = "status";
            status.className = "status";
            status.innerHTML = "No Rooms available";
            liste.appendChild(status);
        }
    });
    socket.emit('joinLobby');

    function named(){
        liste.style.visibility = "visible";
        form.style.visibility = "hidden";
        lobby.style.visibility = "hidden";
        nameButton.style.visibility = "hidden";
    }

    function submitJoin(id){
        var name = nick.value;
        var length = name.length;

        if( length != 0) {
            var nr = parseInt(id);
            hidden.setAttribute("value", nr);
            //alert(hidden.value);
            $(form).submit();
        }else{
            alert("Please enter a Nickname :)");
            window.location.reload();
        }
    }

    function addHandler(div){
        $(div).on("click",function(){submitJoin(div.id);});
    }



    function createListItem(listItem){

        var item = document.createElement("button");
        item.id = listItem;
        item.innerHTML=listItem;
        item.setAttribute("value",listItem);
        liste.appendChild(item);
        addHandler(item);


    }
    socket.on('update',function(data){
        console.log(data);
            $(liste).empty();
            data.forEach(createListItem);
        var test = liste.firstChild;
        console.log(test + " das FirstChild");
        if(test == undefined || test == null){
            var status = document.createElement("element");
            status.id = "status";
            status.className = "status";
            status.innerHTML = "No Rooms available";
            liste.appendChild(status);
        }

    });

}