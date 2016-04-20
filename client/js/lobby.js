function lobby(){

    var socket = io();

    var form = document.getElementById("form");
    var hidden = document.getElementById("hidden");
    var liste = document.getElementById("liste");
    var check = false;

    socket.emit('getUpdate', 'getUpdateSuccess', function(array){
        console.log(array);
        $(liste).empty();
        array.forEach(createListItem);
        check = true;
    });



    function submitJoin(id){
        var nr = parseInt(id);

        hidden.setAttribute("value",nr);
        //alert(hidden.value);
        $(form).submit();
    }

    function addHandler(div){
        $(div).on("click",function(){submitJoin(div.id);});
    }



    function createListItem(listItem){

        var item = document.createElement("button");
        item.id = listItem;
        item.innerHTML=listItem;
        item.setAttribute("value",listItem);;
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