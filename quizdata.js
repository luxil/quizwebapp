exports.get = function (qty){

    var mongodb = require('mongodb');

    var MongoClient = mongodb.MongoClient;


    var url = 'mongodb://localhost:27017/test';

    var output = [];
    var count;

    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)
            console.log('Connection established to', url);

            // Get the documents collection
            var collection = db.collection('Fragen');

            count = collection.count({}, function (error, count) {
                console.log(error, count);
            });

           // parseInt(count);
            //console.log(count.toString() + " aus Mongodb");
            /*
            if(count < qty){
                // do nothing
            }
            else
            {


                //Create some questions
                var question1 = {question: frage, Answers: [antwort,antwort1,antwort2,antwort3]};
                //var question2 = {question: 'Frage2', rightAnswer: 'richtig', wrongAnswers: ['falsch1', 'falsch2', 'falsch3']};

                // Insert some users
                collection.insert(question1, function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Inserted %d documents into the "questions" collection. The documents inserted with "_id" are:', result.length, result);
                    }
                    //Close connection
                    db.close();
                });
            }   */
        };
        db.close();
        return count;
    });

};