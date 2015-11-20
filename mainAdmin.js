var catalogueMenu = require('./catalogueMenu.js');
var assert = require('assert');

var MongoClient = require('mongodb').MongoClient;
var dbHost = 'mongodb://localhost:27017/test';
var questionCatalog = 'questionCatalog';  //collection
var tempCatName = 'Default/';
var dbConn;

MongoClient.connect(dbHost, function(err, db){
    if ( err ) throw err;
    dbConn = db;
    catalogueMenu.catMenu(dbConn);
});
