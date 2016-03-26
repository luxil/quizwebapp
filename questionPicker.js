var questionPicker = require('./questionPicker.js');

var readline = require('readline');
var rl = readline.createInterface({input: process.stdin, output: process.stdout, terminal: false});
//var assert = require('assert');

var MongoClient = require('mongodb').MongoClient;
var dbHost = 'mongodb://localhost:27017/test';
var questionCatalog = 'questionCatalog';  //collection
var tempCatName = 'Default/';
var dbConn;

MongoClient.connect(dbHost, function(err, db){
    if ( err ) throw err;
    dbConn = db;
    //questionPicker.pickQuestions(1, dbConn);
});

var pickQuestions = function(tempCatID, db){

    db.collection(questionCatalog).find({catID: tempCatID}).toArray(
        function(err, docs){
            rl.question("Anzahl der Fragen fuer das Quiz (hoechtens " + docs.length + "): ", function(quantity){
                var quantityOk = false;
                if (quantity>docs.length){
                    console.log("Nicht genügend Fragen vorhanden. Gib eine kleine Zahl als " + docs.length + " ein." );
                    pickQuestions(tempCatID, dbConn);
                }   else  quantityOk = true;

                if (quantityOk) {
                    //QIDs aller zum Katalog gehörenden Fragen
                    var questIDArray = new Array();
                    for (index in docs) {questIDArray.push(docs[index].questionID);}
                    shuffle(questIDArray);

                    //ausgesuchte QIDs, Anzahl richtet sich nach quantity
                    var pickedQuestID = new Array();
                    for (var i = 0; i < quantity; i++) {
                        pickedQuestID.push(questIDArray[i]);
                    }

                    console.log("Your questions: ");
                    for (item in pickedQuestID) {
                        console.log("[" + item + "] " + docs[item].question);
                    }
                }
            })
        }
    );
}
exports.pickQuestions= pickQuestions;

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}