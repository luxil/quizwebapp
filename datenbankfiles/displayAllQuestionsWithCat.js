var MongoClient = require('mongodb').MongoClient;
var dbHost = 'mongodb://localhost:27017/test';
var questionCatalog = 'questionCatalog';
var dbConn;
var index = require('../index');
var io = index.io;

io.on('connection', function(socket) {
    socket.on('getQuestions', function (data) {
        var allQuestions;
        allQuestions = [];
        var questionProcessed = 0;
        var tempCatID = data.catID;
        if(tempCatID != 10000) {
            dbConn.collection(questionCatalog).find({catID: tempCatID}).toArray(
                function (err, docs) {
                    for (index = 0; index < docs.length; index++) {
                        //console.log("[" + index + "]" + docs[index].question);
                        allQuestions.push([docs[index].questionID, docs[index].question, docs[index].rigAns, docs[index].wroAns1,
                            docs[index].wroAns2, docs[index].wroAns3, docs[index].rigAns
                        ]);
                        questionProcessed++;
                        if (questionProcessed === docs.length) {
                            //console.log('allQuestion in disyplay: ' + allQuestions);
                            //socket.emit('showQuestions', {anzahl: anzahl,raum:room, allQuestions: allQuestions});
                            socket.emit('showQuestions', {raum: data.room, allQuestions: allQuestions});
                        }
                    }
                }
            );
        }
        else{
            dbConn.collection(questionCatalog).find({}, {}, {}).toArray(
                function (err, docs) {
                    for (index = 0; index < docs.length; index++) {
                        //console.log("[" + index + "]" + docs[index].question);
                        allQuestions.push([docs[index].questionID, docs[index].question, docs[index].rigAns, docs[index].wroAns1,
                            docs[index].wroAns2, docs[index].wroAns3, docs[index].rigAns
                        ]);
                        questionProcessed++;
                        if (questionProcessed === docs.length) {
                            //console.log('allQuestion in disyplay: ' + allQuestions);
                            //socket.emit('showQuestions', {anzahl: anzahl,raum:room, allQuestions: allQuestions});
                            socket.emit('showQuestions', {raum: data.room, allQuestions: allQuestions});
                        }
                    }
                }
            );
        }
    })
})

MongoClient.connect(dbHost, function(err, db){
    if ( err ) throw err;
    dbConn = db;
    //actionMenu(dbConn, tempCatName, tempCatID);//////////////
});