var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);
var questions = new Array();
var assert = require('assert');

var MongoClient = require('mongodb').MongoClient;
var dbHost = 'mongodb://localhost:27017/test';
var myCollection = "Fragen";
var dbConn;

var actionMenu = function(db) {
    console.log("\nWhat do you want to do?");
    console.log("[1] Add question");
    console.log("[2] Show questions");
    console.log("[3] Remove question");
    console.log("[Q] Quit programm");
    rl.question("Enter the number: ", function(input){
        switch(input.toLowerCase()){
            case "1":
                addAnswer(dbConn);
                break;
            case "2":
                listQuestions(dbConn);
                break;
            case "q":
                process.exit();
                break;
            default :
                console.log("Invalid input");
                actionMenu();
                break;
        }
    });
}


function addAnswer(db){
    rl.prompt;
    rl.question("Question: " + "\n", function(quest) {
        questions.push(quest);
        rl.question("Right answer: " + "\n", function(answer1) {
            questions.push(answer1);
            rl.question("Wrong answer 1: " + "\n", function(answer2) {
                questions.push(answer2);
                rl.question("Wrong answer 2: " + "\n", function(answer3) {
                    questions.push(answer3);
                    rl.question("Wrong answer 3: " + "\n", function(answer4) {
                        questions.push(answer4);
                        var insertQuestion = function(db, callback){
                            db.collection(myCollection).insertOne({
                                'question': quest,
                                'rigAns': answer1,
                                'wroAns1': answer2,
                                'wroAns2': answer3,
                                'wroAns3': answer4
                            }, function(err, result) {
                                assert.equal(err, null);
                                console.log("Inserted a document into the restaurants collection.");
                                callback(result);
                            });
                        }
                        MongoClient.connect(dbHost, function(err, db) {
                            assert.equal(null, err);
                            insertQuestion(db, function() {
                                db.close();
                            });
                            actionMenu(dbConn);
                        });
                    });
                });
            });
        });
    });
}

var listQuestions= function(db){
    //db.collection(myCollection).find({},{},{}).toArray(
    db.collection(myCollection).find({},{},{}).toArray(
    function(err, docs){
        console.log("\nHere is the list: ");
        var numQuestion = 1;
        for(index in docs){
            console.log(index + ". " + docs[index].question);
        }
        actionMenu(dbConn);
    }
    );
}

MongoClient.connect(dbHost, function(err, db){
    if ( err ) throw err;
    dbConn = db;
    actionMenu();
    console.log("connect");
});








