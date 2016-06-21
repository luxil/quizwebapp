function lobby(){

    var socket = io();

    var form = document.getElementById("form");
    var hidden = document.getElementById("hidden");
    var liste = document.getElementById("liste");
    var nick = document.getElementById("nick");
    var lobby = document.getElementById("lobby");
    var nameButton = document.getElementById("nameButton");
    var reset = document.getElementById("resetName");

    // Wenn reset eine ID enthaelt wird der Name eingesetzt und die Liste angezeigt
    if(reset.innerHTML != null && reset.innerHTML != undefined && reset.innerHTML != ""){
        nick.value = reset.innerHTML;
        named();
    }
    // Dieser jQuery Handler verhindert ein ungewolltes Ausloesen von form.submit()
    $('.noEnterSubmit').keypress(function(e){
        if ( e.which == 13 ) e.preventDefault();
    });


    //Dieser Handler sendet ein getUpdate und erhaelt als Callback die Liste der
    // aktuell verfuegbaren Quiz Raeumen.
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
    // Hier teilt der Client dem Server mit, dass er dem Lobby Channel beitreten moechte.
    socket.emit('joinLobby');

    // Aendert die Ansicht auf die Lobbyliste
    function named(){
        liste.style.visibility = "visible";
        form.style.visibility = "hidden";
        lobby.style.visibility = "hidden";
        nameButton.parentNode.style.visibility = "hidden";
    }
    // Hier wird der Beitritt eines User ausgeloest
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
    // Einzelne Lobby items werden mit dem submitJoin verbunden
    function addHandler(div){
        $(div).on("click",function(){submitJoin(div.id);});
    }


    // Hier wird die Lobbyliste generiert
    function createListItem(listItem){

        var item = document.createElement("button");
        item.id = listItem;
        item.innerHTML=listItem;
        item.setAttribute("value",listItem);
        liste.appendChild(item);
        addHandler(item);


    }
    // Event wenn die Raumliste veraendert wurde
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

    // Eventhandler wird angehaengt
    nameButton.addEventListener("click",named);

    // Anpassung der Styles fuer desktop
    function changeStyles(){
        var width = window.innerWidth;
        if(width > 768){
            var logo = document.getElementById("logo");
            logo.firstChild.style.width = "70px";
            logo.firstChild.style.height = "70px";
            var join = document.getElementById("nameArea");
            join.style.paddingLeft = "40%";
            join.style.paddingRight = "40%";
        }
    }
    $(document).ready(function(){
        changeStyles();
    });
}