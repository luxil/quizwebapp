var catalogueMenu = require('./catalogueMenu.js');
var questionPicker = require('./questionPicker.js');

var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);
var assert = require('assert');

var MongoClient = require('mongodb').MongoClient;
var dbHost = 'mongodb://localhost:27017/test';
var questionCatalog = 'questionCatalog';
var dbConn;
var tempQuestionID = 0;
var tempCatName;
var tempCatID;

var actionMenu = function(db, catName, catId) {
    tempCatID = catId;
    tempCatName = catName;

    console.log("\nYou are in the questioncatalog with the name " + tempCatName);
    console.log("What do you want to do?");
    console.log("[1] Add question to the catalog : " + tempCatName);
    console.log("[2] Show questions from catalog: " + tempCatName);
    console.log("[3] Show questions from all catalogs");
    console.log("[4] Delete question from catalog");
    console.log("[5] Edit question from catalog");
    console.log("[6] Delete all questions in the catalogue");
    console.log("[7] Change catalogue");
    console.log("[8] Pick questions");
    console.log("[Q] Quit programm");
    rl.question("Enter a number or a letter: ", function(input){
        switch(input.toLowerCase()){
            case "1":
                addQuestion(dbConn, tempCatName);
                break;
            case "2":
                displayQuestionsFromCat(dbConn, "list");
                break;
            case "3":
                displayQuestions(dbConn, "list");
                break;
            case "4":
                displayQuestionsFromCat(dbConn, "delete");
                break;
            case "5":
                displayQuestionsFromCat(dbConn, "edit");
                break;
            case "6":
                dbConn.collection(questionCatalog).removeMany();
                console.log("BAM");
                actionMenu(dbConn, tempCatName, tempCatID);
                break;
            case "7":
                catalogueMenu.catMenu(dbConn);
                break;
            case "8":
                questionPicker.pickQuestions(tempCatID, dbConn);
                break;
            case "q":
                process.exit();
                break;
            default :
                console.log("Invalid input");
                actionMenu(dbConn, tempCatName, tempCatID);
                break;
        }
    });
}
exports.actionMenu = actionMenu;


function addQuestion(db){
    db.collection(questionCatalog).find({},{},{}).toArray(
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
                            db.collection(questionCatalog).insertOne({
                                'questionID': (tempQuestionID),
                                'question': quest,
                                'rigAns': answer1,
                                'wroAns1': answer2,
                                'wroAns2': answer3,
                                'wroAns3': answer4,
                                'catID': tempCatID,
                                'catName': tempCatName
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
                                    actionMenu(dbConn, tempCatName, tempCatID);
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

//action sagt, ob du die Questions nur auflistet("list"), eine Question löscht("delete") oder eine Question bearbeitest"edit")
var displayQuestions = function(db, action){
    db.collection(questionCatalog).find({},{},{}).toArray(
        function(err, docs){
            rl.question("Do you want to show the questions with the answers? [y] or [n]: ", function(answer){
                console.log("\nHere is the list: ");
                if (answer.toLocaleLowerCase() == "y"){
                    for(index in docs){
                        console.log("[" + index + "]");
                        console.log(docs[index]);
                        console.log("\n");
                    }
                    console.log("Press [ENTER] to continue..");
                    rl.on('line', function () {
                        actionMenu(dbConn, tempCatName, tempCatID);
                    });
                }
                else if (answer.toLowerCase() == "n"){
                    for(index in docs){console.log("[" + index + "]" + docs[index].question);}
                    console.log("Press [ENTER] to continue..");
                    rl.on('line', function () {
                        actionMenu(dbConn, tempCatName, tempCatID);
                    });
                }
                else {console.log("Invalid input. Back to Menu"); actionMenu(dbConn, tempCatName, tempCatID);}
                if(action == "list") {actionMenu(dbConn, tempCatName, tempCatID);}
                else if(action == "delete"){deleteQuestion(dbConn)}
                else if(action == "edit"){editQuestion(dbConn)}
            });
        }
    );
};
var displayQuestionsFromCat = function(db, action){
    db.collection(questionCatalog).find({catID: tempCatID}).toArray(
        function(err, docs){
            rl.question("Do you want to show the questions with the answers? [y] or [n]: ", function(answer){
                console.log("\nHere is the list: ");
                if (answer.toLocaleLowerCase() == "y"){
                    for(index in docs){
                        console.log("[" + index + "]");
                        console.log(docs[index]);
                        console.log("\n");
                    }
                    console.log("Press [ENTER] to continue..");
                    rl.on('line', function () {
                        actionMenu(dbConn, tempCatName, tempCatID);
                    });
                }
                else if (answer.toLowerCase() == "n"){
                    for(index in docs){console.log("[" + index + "]" + docs[index].question);}
                    console.log("Press [ENTER] to continue..");
                    rl.on('line', function () {
                        actionMenu(dbConn, tempCatName, tempCatID);
                    });
                }
                else {console.log("Invalid input. Back to Menu"); actionMenu(dbConn, tempCatName, tempCatID);}
                if(action == "list") {actionMenu(dbConn, tempCatName, tempCatID);}
                else if(action == "delete"){deleteQuestion(dbConn)}
                else if(action == "edit"){editQuestion(dbConn)}
            });
        }
    );
};


var deleteQuestion = function(db){db.collection(questionCatalog).find({catID: tempCatID}).toArray(
    function(err, questions) {
        rl.question("Which question do you want to delete? Enter the number: ", function (answer) {
            var notFoundQue = true;
            for (index in questions) {
                if (index === answer) {
                    db.collection(questionCatalog).deleteOne(questions[index]);
                    console.log("Succesfully removed");
                    notFoundQue=false;
                    rl.question("Press [ENTER] to continue..", function(){
                        actionMenu(dbConn, tempCatName, tempCatID);
                    });
                }

            }
            //Wenn der Index nicht gefunden wurde
            if(notFoundQue) {
                console.log("Error: There is no question for this number.");
                console.log("Press [ENTER] to continue..");
                rl.on('line', function () {
                    actionMenu(dbConn, tempCatName, tempCatID);
                });
            }
        });
    }
)};


var editQuestion = function(db){db.collection(questionCatalog).find({catID: tempCatID}).toArray(
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
                                    db.collection(questionCatalog).updateOne(
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
                                    db.collection(questionCatalog).updateOne(
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
                                    db.collection(questionCatalog).updateOne(
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
                                    db.collection(questionCatalog).updateOne(
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
                                    db.collection(questionCatalog).updateOne(
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
                                actionMenu(dbConn, tempCatName, tempCatID);
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
                    actionMenu(dbConn, tempCatName, tempCatID);
                });
            }////////////////
        });
    }
)};


MongoClient.connect(dbHost, function(err, db){
    if ( err ) throw err;
    dbConn = db;
    //actionMenu(dbConn, tempCatName, tempCatID);//////////////
});


var editQuestionHandler = function(err){
    if (err) throw (err);
    console.log("Succesfully edited");
    console.log("Do you want to edit another question? [y] or [n]");
    var editAnotherQuestion = function () {
        rl.question('', function (again) {
            if (again === 'y') editQuestion(dbConn);
            else if (again === 'n') actionMenu(dbConn, tempCatName, tempCatID);
            else {console.log("Please enter [y] or [n]"); editAnotherQuestion();}
        });
    }
    editAnotherQuestion();
}

/**
 * To do
 * -mehrere Fragenkataloge können erstellt werden
 *
 */


