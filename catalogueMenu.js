/**
 * Hier befindet sich die ganze Logik für das Katalogmenü
 */

var admin = require('./admin.js');  //benötigt dieses Modul, damit man später in das Menü wechseln kann, die Fragen zu hinzuzufügen, zu löschen und zu bearbeiten

//diese Module sind wichtig, damit die Eingaben von der Konsole verarbeitet werden können
var readline = require('readline');
var rl = readline.createInterface({input: process.stdin, output: process.stdout, terminal: false});

//Konfigurationen für die Datenbank, auf  die man zugreift
var MongoClient = require('mongodb').MongoClient;
var dbHost = 'mongodb://localhost:27017/test';

//Variablen, die zum Bearbeiten des Katalogmenüs benötigt werden
var questionCatalog = 'questionCatalog';  //collection
var tempCatName = 'Default/';
var dbConn;
var tempCatID = 0;

//Auswahlmenü, wo man entscheiden kann, ob man eine neue Kategorie erstellen möchte oder auf einen bereits existierenden zugreifen möchte
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

//Funktion zum Ermitteln der höchsten Kategorie-ID Zahl; Wird zum Erstellen einer neuen Kategorie benötigt
var getBiggestCatID = function(docs){
    var biggestCatIdIndex = 0;
    for (index in docs) {
        if (docs[biggestCatIdIndex].catID <= docs[index].catID) {
            biggestCatIdIndex = index;
        }
    }
    console.log("big catID" + docs[biggestCatIdIndex].catID);
    return docs[biggestCatIdIndex].catID;
}

//Funktion zum Erstellen einer neuen Kategorie
var createCat = function(db){
    db.collection(questionCatalog).find({},{},{}).toArray(
        function(err, docs) {
            if (docs.length != 0) {
                //die ID der neuen Kategorie ist um eins höher als die der bisherigen höchsten Kategorie ID
                var biggestCatID = getBiggestCatID(docs);
                tempCatID = biggestCatID + 1;
            }

            //Name der neuen Kategorie eingeben
            rl.question("Enter the name of the new catalog: ", function(input){
                tempCatName = input;
                console.log("Succesfully created and changed to the catalog: " + tempCatName + ' with the catalogID: ' + tempCatID);
                rl.question("Press [ENTER] to continue..", function(){
                    admin.actionMenu(dbConn, tempCatName, tempCatID);
                });
            })
        }
    );
    return false;
}

//listet die ganzen Kategorien auf, die schon erstellt wurden
var listCats = function(db) {
    var cursor = db.collection(questionCatalog).find({}, {}, {});
    cursor.toArray(
        function (err, docs) {
            if (docs.length != 0) {
                var biggestCatID = getBiggestCatID(docs);
                //var numCatID = 0;
                var chooseCat = function () {
                    //mithilfe der Eingabe einer Nummer gibt man an, zu welcher Kategorie man wechseln möchte
                    rl.question("To which catalog you want to change? Enter the number: ", function (input) {
                            var catIDFound = false;
                            for (index in docs) {
                                if (docs[index].catID === parseInt(input)) {
                                    console.log("catName: " + docs[index].catName);
                                    tempCatName = docs[index].catName;
                                    tempCatID = docs[index].catID;
                                    catIDFound = true;
                                    break;
                                }
                            }
                            if (!catIDFound) {
                                console.log("Error: No catalog for input");
                                rl.question("Back with [Enter]..", function (input) {
                                    catMenu(dbConn)
                                });
                            } else  admin.actionMenu(dbConn, tempCatName, tempCatID);
                        }
                    )
                    return false;
                }
                //Funktion, die zur ID der Kategorie den Namen der Kategorie anzeigt
                var catIDforCatName = function () {
                    for (var numCatID = 0; numCatID <= biggestCatID; numCatID++) {
                        var foundtest = false;
                        for (index in docs) {
                            if (numCatID === docs[index].catID && foundtest === false) {
                                console.log("[" + docs[index].catID + "] " + docs[index].catName);
                                foundtest = true;
                                if (numCatID === biggestCatID) {
                                    chooseCat();
                                }
                            }

                        }
                    }

                    return true;
                }
                catIDforCatName();

            } else{
                console.log("No categories avaiable. First create one. ");
                rl.question("Back with [Enter]..", function (input) {
                    catMenu(dbConn)
                });
            }


        }
    )
    return false;
}


MongoClient.connect(dbHost, function(err, db){
    if ( err ) throw err;
    dbConn = db;
});
