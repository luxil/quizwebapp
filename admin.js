var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);
var questions = new Array();
var assert = require('assert');

var MongoClient = require('mongodb').MongoClient;
var dbHost = 'mongodb://localhost:27017/test';
var myCollection = "Fragen";
var dbConn;
var listed = false; ///////////test

var actionMenu = function(db) {
    console.log("\nWhat do you want to do?");
    console.log("[1] Add question");
    console.log("[2] Show questions");
    console.log("[3] Delete question");
    console.log("[4] Edit question");
    console.log("[Q] Quit programm");
    rl.question("Enter a number or a letter: ", function(input){
        switch(input.toLowerCase()){
            case "1":
                addAnswer(dbConn);
                break;
            case "2":
                displayQuestions(dbConn, "list");
                break;
            case "3":
                displayQuestions(dbConn, "delete");
                break;
            case "4":
                displayQuestions(dbConn, "edit");
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
                                callback(result);
                            });
                        }
                        MongoClient.connect(dbHost, function(err, db) {
                            assert.equal(null, err);
                            insertQuestion(db, function() {
                                db.close();
                                console.log("Succesfully added question");
                                rl.question("Press [ENTER] to continue..", function(){
                                    actionMenu(dbConn);
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

//action sagt, ob du die Questions nur auflistet("list"), eine Question löscht("delete") oder eine Question bearbeitet"edit")
var displayQuestions = function(db, action){
    db.collection(myCollection).find({},{},{}).toArray(
    function(err, docs){
        rl.question("Do you want to show the questions with the answers? [y] or [n]: ", function(answer){
            console.log("\nHere is the list: ");
            if (answer.toLocaleLowerCase() == "y"){
                for(index in docs){
                    console.log(index + ".");
                    console.log(docs[index]);
                    console.log("\n");
                }
            }
            else if (answer.toLowerCase() == "n"){
                for(index in docs){console.log(index + ". " + docs[index].question);}
            }
            else {console.log("Invalid input. Back to Menu");}
            if(action == "list") {actionMenu(dbConn);}
            else if(action == "delete"){deleteQuestion(dbConn)}
            else if(action == "edit"){editQuestion(dbConn)}
        });
    }
    );
};

var editQuestion = function(db){db.collection(myCollection).find({},{},{}).toArray(
    function(err, questions) {
        rl.question("Which question do you want to edit? Enter the number: ", function (answer) {
            for (index in questions) {
                if (index === answer) {
                    console.log("Question to edit: ");
                    console.log(questions[index]);
                    console.log("Succesfully edited");
                    rl.question("Press [ENTER] to continue..", function(){
                        actionMenu(dbConn);
                    });
                    break;
                }
            }
            //Wenn der Index nicht gefunden wurde
            console.log("Error: There is no question for this number.");
            actionMenu();

        });
    }
)};

var deleteQuestion = function(db){db.collection(myCollection).find({},{},{}).toArray(
        function(err, questions) {
            rl.question("Which question do you want to delete? Enter the number: ", function (answer) {
                var notFoundQue = true;
                for (index in questions) {
                    if (index === answer) {
                        db.collection(myCollection).deleteOne(questions[index]);
                        console.log("Succesfully removed");
                        notFoundQue=false;
                        rl.question("Press [ENTER] to continue..", function(){
                            actionMenu(dbConn);
                        });
                    }

                }
                //Wenn der Index nicht gefunden wurde
                if(notFoundQue) {////////////
                    console.log("Error: There is no question for this number.");
                    console.log("Press [ENTER] to continue..");
                    rl.on('line', function () {
                        actionMenu(dbConn);
                    });
                }////////////////
            });
        }
)};

MongoClient.connect(dbHost, function(err, db){
    if ( err ) throw err;
    dbConn = db;
    actionMenu();
});








