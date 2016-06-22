/**
 * hier werden die Kategorien aus der Datenbank aufgerufen und an den Admin gesendet
 */

var MongoClient = require('mongodb').MongoClient;
var dbHost = 'mongodb://localhost:27017/test';
var questionCatalog = 'questionCatalog';
var dbConn;
var index = require('../index');
var io = index.io;

io.on('connection', function(socket) {
    socket.on('getCats', function (data) {
        var allCats;
        allCats = [];
        var numCatID = 0;

        var cursor = dbConn.collection(questionCatalog).find({}, {}, {});
        cursor.toArray(
            function (err, docs) {
                var biggestCatID= getBiggestCatID(docs);
                if (docs.length != 0) {
                    console.log("testgetCatsScript");
                    var catIDforCatName = function() {
                        for (index = 0; index < docs.length; index++) {
                            if (numCatID === docs[index].catID) {
                                console.log("[" + docs[index].catID + "] " + docs[index].catName);
                                allCats.push([docs[index].catID, docs[index].catName]);
                                numCatID++;
                                catIDforCatName();
                            }
                            else if (numCatID > biggestCatID) {
                                //console.log(numCatID + " und " + biggestCatID);
                                socket.emit('tempCatNamesAndIDs', {allCats: allCats});
                                index = docs.length;
                                //console.log('allCats in disyplay: ' + allCats);
                            }
                        }
                    }
                    catIDforCatName();
                } else{
                    console.log("No categories avaiable. First create one. ");
                }
                /* funktioniert vllt schneller??
                if (docs.length != 0) {
                    var catIDforCatName = function(){
                        for(index in docs){
                            if (numCatID === docs[index].catID){
                                //console.log("[" + docs[index].catID + "] " + docs[index].catName);
                                allCats.push(docs[index].catID, docs[index].catName);
                                numCatID++;
                                console.log(numCatID);
                                if(numCatID===biggestCatID){
                                    console.log(numCatID + " und" + biggestCatID);
                                    //console.log('allCats in disyplay: ' + allCats);
                                    //socket.emit('tempCatNamesAndIDs', {allCats: allCats});
                                }
                            }
                        }
                    }
                    while (numCatID <= biggestCatID) catIDforCatName();
                } else{
                    console.log("No categories avaiable. First create one. ");
                }*/
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
});