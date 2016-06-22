/**
 * Hier befindet sich die ganze Logik für das Fragenmeenü
 */
var catalogueMenu = require('./catalogueMenu.js');
var questionPicker = require('./questionPicker.js');

//diese Module sind wichtig, damit die Eingaben von der Konsole verarbeitet werden können
var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);
var assert = require('assert');

//Konfigurationen für die Datenbank, auf  die man zugreift
var MongoClient = require('mongodb').MongoClient;
var dbHost = 'mongodb://localhost:27017/test';

//Variablen, die hilfreich sind, um beispielsweise Fragen hinzuzufügen und dabei jede Frage mit einer eigenen ID zu vergeben
var questionCatalog = 'questionCatalog';
var dbConn;
var tempQuestionID = 0;
var tempCatName;
var tempCatID;

//Auswahlmenü, wo der Benutzer zur Aktion aufgefordert wird
var actionMenu = function(db, catName, catId) {
    //zunächst sollten ID und Name von der Kategorie, die man bearbeiten möchte, temporär übergeben werden
    tempCatID = catId;
    tempCatName = catName;

    console.log("\nYou are in the question catalog with the name " + tempCatName);
    console.log("What do you want to do?");
    console.log("[1] Add question to the catalog " + tempCatName);
    console.log("[2] Show questions from catalog " + tempCatName);
    console.log("[3] Show questions from all catalogs");
    console.log("[4] Delete question from catalog");
    console.log("[5] Edit question from catalog");
    console.log("[6] Delete all catalogs and questions");
    console.log("[7] Change catalog");
    /*console.log("[8] Pick questions");*/
    console.log("[9] Delete all questions from catalog");
    console.log("[Q] Quit programm\n");
    rl.question("Enter a number or a letter: ", function(input){
        switch(input.toLowerCase()){
            //Frage zum Katalog hinzufügen
            case "1":
                addQuestion(dbConn, tempCatName);
                break;
            //Fragen, vom Katalog, in dem man sich befindet, anzeigen
            case "2":
                displayQuestionsFromCat(dbConn, "list");
                break;
            //Fragen von allen Kategorien anzeigen
            case "3":
                displayQuestions(dbConn, "list");
                break;
            //eine Frage löschen
            case "4":
                displayQuestionsFromCat(dbConn, "delete");
                break;
            //eine Frage bearbeiten
            case "5":
                displayQuestionsFromCat(dbConn, "edit");
                break;
            //alle Fragen vom Katalog löschen, löscht auch den Katalog, sobald man das Menü verlässt
            case "6":
                dbConn.collection(questionCatalog).removeMany();
                console.log("BAM");
                actionMenu(dbConn, tempCatName, tempCatID);
                break;
            //wieder zum Menü, wo man ein Katalog erstellen oder auswählen kann
            case "7":
                catalogueMenu.catMenu(dbConn);
                return false;
                break;
            /*
            case "8":
                questionPicker.pickQuestions(tempCatID, dbConn);
                break;
            */
            case "9":
                deleteAllQuestionsFromCat(dbConn);
                break;
            //Die Anwendung beenden
            case "q":
                process.exit();
                break;
            //bei ungültigen Eingaben wieder zum Auswahlmenü
            default :
                console.log("Invalid input");
                actionMenu(dbConn, tempCatName, tempCatID);
                break;
        }
        return false;
    });
}
exports.actionMenu = actionMenu;

//Funktion, mit der eine Frage hinzugefügt wird
function addQuestion(db){
    //zunächst für die neue Frage eine eigene ID ermitteln
    db.collection(questionCatalog).find({},{},{}).toArray(
        function(err, docs){
            if(docs.length != 0)
            tempQuestionID = (docs[docs.length-1].questionID + 1);
        }
    );
    ///Eigentliche Hinzufügeoption
    rl.prompt;
    //zunächst die benötigten Information für die neue Frage eingeben lassen
    rl.question("Question: " + "\n", function(quest) {
        rl.question("Right answer: " + "\n", function(answer1) {
            rl.question("Wrong answer 1: " + "\n", function(answer2) {
                rl.question("Wrong answer 2: " + "\n", function(answer3) {
                    rl.question("Wrong answer 3: " + "\n", function(answer4) {
                        //Funktion, mit der die Frage zur Datenbank hinzugefügt wird
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
                        //Verbindung zum MongoClienten starten, dabei die Funktion aufrufen, die die Frage zur Datenbank hinzufügt
                        //Bei erfolgreicher Operation gibt es eine Bestätigung, dass die Frage erfolgreich hinzugefügt wurde
                        MongoClient.connect(dbHost, function(err, db) {
                            assert.equal(null, err);
                            insertQuestion(db, function() {
                                db.close();
                                console.log("\nSuccesfully added question");
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

//Funktion zum Anzeigen der Fragen aus allen Kategorien in der Konsole
//action sagt, ob du die Questions nur auflistest("list"), eine Question löscht("delete") oder eine Question bearbeitest"edit")
var displayQuestions = function(db, action){
    db.collection(questionCatalog).find({},{},{}).toArray(
        function(err, docs){
            //zunächst wird gefragt, ob man nur die Fragen an sich oder sie zusammen mit den anderen Informationen wie Antworten anzeigen möchte
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

//Funktion zum Anzeigen der Fragen aus der Kategorie, in der man sich gerade befindet
//action sagt, ob du die Questions nur auflistest("list"), eine Question löscht("delete") oder eine Question bearbeitest"edit")
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

//Funktion zum Löschen einer Frage aus dem Katalog
var deleteQuestion = function(db){db.collection(questionCatalog).find({catID: tempCatID}).toArray(
    function(err, questions) {
        //Vor jeder Frage steht eine Nummer; Es muss die Nummer eingegeben werden, von der Frage, die man löschen möchte
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
            //Wenn der Frage mit der eingegebenen Nummer nicht gefunden wurde, zurück zum Hauptmenü
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

var deleteAllQuestionsFromCat = function(db){db.collection(questionCatalog).find({catID: tempCatID}).toArray(
    function(err, questions) {
        //Vor jeder Frage steht eine Nummer; Es muss die Nummer eingegeben werden, von der Frage, die man löschen möchte
        rl.question("Are you really sure you want to delete all question from the catalog? [y] or [n]", function (answer) {
            if(answer==="y"){
                for (index in questions) {
                        db.collection(questionCatalog).deleteOne(questions[index]);
                        console.log("Succesfully removed");
                        rl.question("Press [ENTER] to continue..", function(){
                            actionMenu(dbConn, tempCatName, tempCatID);
                        });
                }
            }
            ////////////////////bablablbaldlnflasnl

        });
    }
)};

//Funktion zum Bearbeiten der Frage
var editQuestion = function(db){db.collection(questionCatalog).find({catID: tempCatID}).toArray(
    function(err, questions) {
        //Es wird nach der Nummer gefragt, von der Frage, die man bearbeiten möchte
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
                    //Die Nummer eingeben, damit die entsprechende Stelle der Frage bearbeitet werden kann
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
            //Wenn zu der eingebenen Nummer keine Frage gefunden wurde, zurück zum Hauptmenü
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


MongoClient.connect(dbHost, function(err, db){
    if ( err ) throw err;
    dbConn = db;
});

//Handler, der bestätigt, dass die Frage erfolgreich bearbeitet wurde und danach fragt, ob man noch eine andere Frage bearbeiten möchte
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




