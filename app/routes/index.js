'use strict';

var path = process.cwd();
var SearchHandler = require(path + '/app/controllers/searchHandler.server.js');

module.exports = function (app, db) {

	var searchHandler = new SearchHandler(db);

	//Home router
	app.route('/')
		.get(function (req, res) {
			
			res.sendFile(path + '/public/index.html');
			
		});

	//Recent search router
	app.route('/api/latest/imagesearch')
		.get(function (req, res) {
			
			searchHandler.findRecent(res);
		});

	//Image search query router
	app.route('/api/imagesearch/:searchTerm')
		.get(function (req, res) {
			
			searchHandler.searchImages(req, res);
			
		});
};
