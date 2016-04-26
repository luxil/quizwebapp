function score(){
    var liste = document.getElementById("liste");
    var socket = io();
    var counter = 0;
    var id= document.getElementById("id");
    var nr = parseInt(id.innerHTML);

    socket.emit('getList',nr);


    socket.on('getListSuccess',function(data){
        console.log("daten kamen" + data);
        data.forEach(createListItem);
    })

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


};