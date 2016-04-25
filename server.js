'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongo = require("mongodb").MongoClient;
var mongoURI = process.env.Mongo_URI || 'mongodb://localhost:27017/imagesearch';


var app = express();

app.use('/public', express.static(process.cwd() + '/public'));

mongo.connect(mongoURI, function(err, db) {
	if (err) {throw new Error('Database failed to connect!');}

	db = db.collection("recentQueries");
	
	routes(app, db);

	var port = process.env.PORT;
	app.listen(port,  function () {
		console.log('server.js listening on port ' + port + '...');	
	
	});
});