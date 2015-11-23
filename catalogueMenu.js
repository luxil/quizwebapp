var admin = require('./admin.js');

var readline = require('readline');
var rl = readline.createInterface({input: process.stdin, output: process.stdout, terminal: false});
//var assert = require('assert');

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
    rl.question("Enter a number: ", function(input) {
        console.log("input: " + input );
        switch (input.toLowerCase()) {
            case "1":
                createCat(dbConn);
                break;
            case "2":
                listCats(dbConn);
                break;
            case "3":
                break;
            default:
                console.log("Wrong input");
                catMenu(db)
                break;
        }
    });
}
exports.catMenu = catMenu;

var getBiggestCatID = function(docs){
    var biggestCatIdIndex = 0;
    for (index in docs) {
        if (docs[biggestCatIdIndex].catID <= docs[index].catID) {
            biggestCatIdIndex = index;
        }
    }
    return docs[biggestCatIdIndex].catID;
}

var createCat = function(db){
    db.collection(questionCatalog).find({},{},{}).toArray(
        function(err, docs) {
            if (docs.length != 0) {
                ////////
                var biggestCatID = getBiggestCatID(docs);
                tempCatID = biggestCatID + 1;
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
    var cursor = db.collection(questionCatalog).find({}, {}, {});
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
                rl.question("Back with [Enter]..", function (input) {
                    catMenu(dbConn)
                });
            }

            rl.question("To which catalog you want to change? Enter the number: ", function(input){
                    var catIDFound = false;
                    for (index in docs){
                        if(docs[index].catID === parseInt(input)){
                            console.log("catName: " + docs[index].catName);
                            tempCatName = docs[index].catName;
                            tempCatID = docs[index].catID;
                            catIDFound = true;
                            break;
                        }
                    }
                    if (!catIDFound){
                        console.log("Error: No catalog for input");
                        rl.question("Back with [Enter]..", function(input){catMenu(dbConn)});
                    } else  admin.actionMenu(dbConn, tempCatName, tempCatID);
                }
            )

        }
    )
}


MongoClient.connect(dbHost, function(err, db){
    if ( err ) throw err;
    dbConn = db;
});
