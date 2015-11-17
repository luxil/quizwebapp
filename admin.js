var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);
var assert = require('assert');

var MongoClient = require('mongodb').MongoClient;
var dbHost = 'mongodb://localhost:27017/test';
var questionCatalogue = "Fragen";
var dbConn;
var tempQuestionID = 0;


var actionMenu = function(db) {
    console.log("\nWhat do you want to do?");
    console.log("[1] Add question");
    console.log("[2] Show questions");
    console.log("[3] Delete question");
    console.log("[4] Edit question");
    console.log("[5] Delete all questions in the catalogue");
    console.log("[6] Change catalogue");
    console.log("[Q] Quit programm");
    rl.question("Enter a number or a letter: ", function(input){
        switch(input.toLowerCase()){
            case "1":
                addQuestion(dbConn);
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
            case "5":
                dbConn.collection(questionCatalogue).removeMany();
                console.log("BAM");
                actionMenu(dbConn);
                break;
            case "5":
                /////////////////////////////////////Katalog
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


function addQuestion(db){
    db.collection(questionCatalogue).find({},{},{}).toArray(
        function(err, docs){
            if(docs.length != 0)
            tempQuestionID = (docs[docs.length-1].questionID + 1);
        }
    );
    ///Eigentliche Hinzufügeoption
    rl.prompt;
    rl.question("Question: " + "\n", function(quest) {
        rl.question("Right answer: " + "\n", function(answer1) {
            rl.question("Wrong answer 1: " + "\n", function(answer2) {
                rl.question("Wrong answer 2: " + "\n", function(answer3) {
                    rl.question("Wrong answer 3: " + "\n", function(answer4) {
                        var insertQuestion = function(db, callback){
                            db.collection(questionCatalogue).insertOne({
                                'questionID': (tempQuestionID),
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
                                console.log("questionID of the new question: " + tempQuestionID);
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
    db.collection(questionCatalogue).find({},{},{}).toArray(
        function(err, docs){
            rl.question("Do you want to show the questions with the answers? [y] or [n]: ", function(answer){
                console.log("\nHere is the list: ");
                if (answer.toLocaleLowerCase() == "y"){
                    for(index in docs){
                        console.log("[" + index + "]");
                        console.log(docs[index]);
                        console.log("\n");
                    }
                }
                else if (answer.toLowerCase() == "n"){
                    for(index in docs){console.log("[" + index + "]" + docs[index].question);}
                }
                else {console.log("Invalid input. Back to Menu"); actionMenu(dbConn);}
                if(action == "list") {actionMenu(dbConn);}
                else if(action == "delete"){deleteQuestion(dbConn)}
                else if(action == "edit"){editQuestion(dbConn)}
            });
        }
    );
};


var deleteQuestion = function(db){db.collection(questionCatalogue).find({},{},{}).toArray(
    function(err, questions) {
        rl.question("Which question do you want to delete? Enter the number: ", function (answer) {
            var notFoundQue = true;
            for (index in questions) {
                if (index === answer) {
                    db.collection(questionCatalogue).deleteOne(questions[index]);
                    console.log("Succesfully removed");
                    notFoundQue=false;
                    rl.question("Press [ENTER] to continue..", function(){
                        actionMenu(dbConn);
                    });
                }

            }
            //Wenn der Index nicht gefunden wurde
            if(notFoundQue) {
                console.log("Error: There is no question for this number.");
                console.log("Press [ENTER] to continue..");
                rl.on('line', function () {
                    actionMenu(dbConn);
                });
            }
        });
    }
)};


var editQuestion = function(db){db.collection(questionCatalogue).find({},{},{}).toArray(
    function(err, questions) {
        rl.question("Which question do you want to edit? Enter the number: ", function (answer) {
            var notFoundQue = true;
            for (index in questions) {
                if (index === answer) {
                    notFoundQue = false;
                    console.log("Question to edit: ");
                    console.log("[0] Question: " + questions[index].question);
                    console.log("[1] Right Answer: " + questions[index].rigAns);
                    console.log("[2] Wrong Answer 1: " + questions[index].wroAns1);
                    console.log("[3] Wrong Answer 2: " + questions[index].wroAns2);
                    console.log("[4] Wrong Answer 3: " + questions[index].wroAns3 + "\n");
                    rl.question("What do you want to edit? Enter the NUMBER: ", function (input) {
                        console.log(input);
                        switch (input) {
                            case '0':
                                rl.question("Edit question:  ", function (newText) {
                                    db.collection(questionCatalogue).updateOne(
                                        {questionID: questions[answer].questionID},
                                        {
                                            $set: {
                                                question: newText
                                            }
                                        }, function (err, results) {
                                            editQuestionHandler();
                                        }
                                    );
                                });
                                break;
                            case '1':
                                rl.question("Edit right answer:  ", function (newText) {
                                    db.collection(questionCatalogue).updateOne(
                                        {questionID: questions[answer].questionID},
                                        {
                                            $set: {
                                                rigAns: newText
                                            }
                                        }, function (err, results) {
                                            editQuestionHandler();
                                        }
                                    );
                                });
                                break;
                            case '2':
                                rl.question("Edit wrong answer 1:  ", function (newText) {
                                    db.collection(questionCatalogue).updateOne(
                                        {questionID: questions[answer].questionID},
                                        {
                                            $set: {
                                                wroAns1: newText
                                            }
                                        }, function (err, results) {
                                            editQuestionHandler();
                                        }
                                    );
                                });
                                break;
                            case '3':
                                rl.question("Edit wrong answer 2:  ", function (newText) {
                                    db.collection(questionCatalogue).updateOne(
                                        {questionID: questions[answer].questionID},
                                        {
                                            $set: {
                                                wroAns2: newText
                                            }
                                        }, function (err, results) {
                                            editQuestionHandler();
                                        }
                                    );
                                });
                                break;
                            case '4':
                                rl.question("Edit wrong answer 3:  ", function (newText) {
                                    db.collection(questionCatalogue).updateOne(
                                        {questionID: questions[answer].questionID},
                                        {
                                            $set: {
                                                wroAns3: newText
                                            }
                                        }, function (err) {
                                            editQuestionHandler(err);
                                        }
                                    );
                                });
                                break;
                            default:
                                console.log("Invalid input. Back to menu");
                                actionMenu(dbConn);
                        }
                    });
                    if (notFoundQue) {
                    }
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


var editQuestionHandler = function(err){
    if (err) throw (err);
    console.log("Succesfully edited");
    console.log("Do you want to edit another question? [y] or [n]");
    var editAnotherQuestion = function () {
        rl.question('', function (again) {
            if (again === 'y') editQuestion(dbConn);
            else if (again === 'n') actionMenu(dbConn);
            else {console.log("Please enter [y] or [n]"); editAnotherQuestion();}
        });
    }
    editAnotherQuestion();
}

var catalogueMenu = function(db){

}
/**
 * To do
 * -mehrere Fragenkataloge können erstellt werden
 *
 */

module.exports = actionMenu;
module.exports = dbConn;

