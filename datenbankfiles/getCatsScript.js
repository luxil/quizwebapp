var MongoClient = require('mongodb').MongoClient;
var dbHost = 'mongodb://localhost:27017/test';
var questionCatalog = 'questionCatalog';
var dbConn;
var index = require('../index');
var io = index.io;

io.on('connection', function(socket) {
    socket.on('getCats', function (data) {
        var allCats;
        console.log("testgetCatsScript");
        var cursor = dbConn.collection(questionCatalog).find({}, {}, {});
        cursor.toArray(
            function (err, docs) {
                if (docs.length != 0) {
                    var biggestCatID= getBiggestCatID(docs);
                    var numCatID = 0;
                    var catIDforCatName = function(){
                        for(index in docs){
                            if (numCatID === docs[index].catID){
                                console.log("[" + docs[index].catID + "] " + docs[index].catName);
                                numCatID++;
                            }
                        }
                    }
                    while (numCatID < biggestCatID) catIDforCatName();
                } else{
                    console.log("No categories avaiable. First create one. ");
                }
            }
        )
    })
})

var getBiggestCatID = function(docs){
    var biggestCatIdIndex = 0;
    for (index in docs) {
        if (docs[biggestCatIdIndex].catID <= docs[index].catID) {
            biggestCatIdIndex = index;
        }
    }
    return docs[biggestCatIdIndex].catID;
}

MongoClient.connect(dbHost, function(err, db){
    if ( err ) throw err;
    dbConn = db;
    //actionMenu(dbConn, tempCatName, tempCatID);//////////////
});