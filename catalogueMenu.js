var admin = require('./admin.js');
var catalogueMenu = require('./catalogueMenu.js');

var readline = require('readline');
var rl = readline.createInterface({input: process.stdin, output: process.stdout, terminal: false});
var assert = require('assert');

var MongoClient = require('mongodb').MongoClient;
var dbHost = 'mongodb://localhost:27017/test';
var questionCatalog = 'questionCatalog';  //collection
var tempCatName = 'Default/';
var dbConn;
var tempCatID = 0;

var catMenu = function (db) {
    console.log("\nWhat do you want to do?");
    console.log("[1] Create new catalog");
    console.log("[2] Change to an existing catalog");
    console.log("[3] Delete an existing catalog");
    rl.question("Enter a number: ", function(input) {
        switch (input.toLowerCase()) {
            case "1":
                createCat(dbConn);
                break;
            case "2":
                listCats(dbConn);
                break;
        }
    });
}
exports.catMenu = catMenu;


var createCat = function(db){
    db.collection(questionCatalog).find({},{},{}).toArray(
        function(err, docs) {
            if (docs.length != 0) {
                var biggestCatIdIndex = 0;
                for (index in docs) {
                    if (docs[biggestCatIdIndex].catID <= docs[index].catID) {
                        biggestCatIdIndex = index;
                    }
                }
                tempCatID = docs[biggestCatIdIndex].catID + 1;
            }

            rl.question("Enter the name of the new catalog: ", function(input){
                tempCatName = input;
                console.log("Succesfully created and changed to the catalog: " + tempCatName + ' with the catalogID: ' + tempCatID);
                rl.question("Press [ENTER] to continue..", function(){
                    admin.actionMenu(dbConn, tempCatName, tempCatID);
                });
            })
        }
    );
}


var listCats = function(db) {
    db.collection(questionCatalog).find({}, {}, {}).toArray(
        function (err, docs) {
            var biggestCatIDIndex= 0;
            console.log("[" + docs[biggestCatIDIndex].catID + "] " + docs[biggestCatIDIndex].catName);
            for(index in docs){
                if(docs[index].catID> docs[biggestCatIDIndex].catID) {
                    biggestCatIDIndex = index;
                    console.log("[" + docs[index].catID + "] " + docs[index].catName);
                }
            }
            rl.question("To which catalog you want to change? Enter the number: ", function(input){
                    for (index in docs){
                        if(docs[index].catID === parseInt(input)){
                            console.log("catName: " + docs[index].catName);
                            tempCatName = docs[index].catName;
                            tempCatID = docs[index].catID;
                            break;
                        }
                    }
                    admin.actionMenu(dbConn, tempCatName, tempCatID);
                }
            )
        }
    )
}


MongoClient.connect(dbHost, function(err, db){
    if ( err ) throw err;
    dbConn = db;
    catMenu(dbConn);
});

/*
var actionMenu = require('./actionMenu');
var dbConn = require('./dbConn');
actionMenu(dbConn);
*/