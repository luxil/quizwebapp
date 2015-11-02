exports.addQuestions = function (frage,antwort,antwort1,antwort2,antwort3){//lets require/import the mongodb native drivers.

  var mongodb = require('mongodb');

  //We need to work with "MongoClient" interface in order to connect to a mongodb server.
  var MongoClient = mongodb.MongoClient;

  // Connection URL. This is where your mongodb server is running.
  var url = 'mongodb://localhost:27017/my_database_name';

  // Use connect method to connect to the Server
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      //HURRAY!! We are connected. :)
      console.log('Connection established to', url);

      // Get the documents collection
      var collection = db.collection('questions');

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
    };
  });

};