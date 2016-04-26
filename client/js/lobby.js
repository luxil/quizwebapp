function lobby(){

    var socket = io();

    var form = document.getElementById("form");
    var hidden = document.getElementById("hidden");
    var liste = document.getElementById("liste");
    var nick = document.getElementById("nick");
    var lobby = document.getElementById("lobby");
    var nameButton = document.getElementById("nameButton");
    var check = false;

    nameButton.style.visibility = "hidden";
    $(nick).bind('input',function(){
        nameButton.style.visibility = "visible";
    });

    nameButton.addEventListener("click",named);

    socket.emit('getUpdate', 'getUpdateSuccess', function(array){
        console.log(array);
        $(liste).empty();
        array.forEach(createListItem);
        check = true;
    });

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
        console.log("update" + data);
        if (check == true){
            $(liste).empty();
            data.forEach(createListItem);
        }
    });

}