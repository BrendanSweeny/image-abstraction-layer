'use strick';

var https = require("https");
//var mongo = require("mongodb").MongoClient;

module.exports = SearchHandler;

function SearchHandler(db) {
	
	//Public function called on GET request to PATH: "/api/latest/imagesearch"
	//returns array of documents corresponding to the most recent search queries
	this.findRecent = function(res) {
		//Finds all documents in a collection, hides _id and expireAt
		db.find({}, { "_id": false, "expireAt": false })
			//Sort descending by date of search
			.sort({ date: -1 })
			//Limit to 10 most recent search queries
			.limit(10)
			.toArray(function(err, array) {
				if (err) { throw err; }
				res.send(array);
			});
		
	};
    
    //Public function called on GET to "/api/imagesearch/:searchTerm"
    //returns array of objects each corresponding to an image received from
    //using 'search gallery' endpoint of Imgur API
    this.searchImages = function(req, res) {
        var searchTerm = req.params.searchTerm;

        //Options for Imgur API call
		var imgurOptions = {
			host: 'api.imgur.com',
			//For future random path: '/3/gallery/random/random/',
			path: '/3/gallery/search/?q=' + encodeURIComponent(searchTerm),
			method: 'GET',
			
			//Imgur API Authorization
			headers: {
				'Authorization': 'CLIENT-ID bff04a364fba73c'
			}
		};
			
		//Imgur API https.request function definition
		var imgurReq = https.request(imgurOptions, function(imgurRes) {
				
			//Stores the recieved chunks
			var data = "";
				
			console.log("API path: " + imgurOptions.path);
				
			imgurRes.setEncoding('utf8');
				
			//Error handling
			imgurRes.on('error', function(err) {
				throw err;
			});
				
			//Data event listener appends to data variable
			imgurRes.on('data', function(chunk) {
				data += chunk;
			});
				
			//End even listener sends data variable to client
			imgurRes.on('end', function() {
				console.log('No more data to receive...');
				
				res.send(formatOutputJSON(req, data));
				//res.send(JSON.parse(data));
				
				//Add search query to 'db.recentQueries' collection after
				//sending data
				db.insert(
					{
						"term": searchTerm,
						"date": new Date(),
				
						//Each doc is set to expire after x number of days
						"expireAt": generateExpiration(7)
					}
				);
				
			});
		});
			
		//ImgurReq https.request is called
		imgurReq.end();
    };
    
    //Private function that transforms data using pagination from offset query
    //and chunk from https.request() to JSON object with
    //title, description, and url as properties for each image
    //	req: express object, used for req.query.offset
    //	data: string of data formed from https response
    function formatOutputJSON(req, data) {
    	
    	//Create JSON from data chunks
    	var dataJSON = JSON.parse(data);

		//Transform offset query to number
		if (req.query.offset) {
			var offset = Number(req.query.offset);
		}
				
		//Pagination restricts number of items in dataJSON
		//if offset is included
		if (offset && typeof offset === "number") {
			var paginateDataJSON = dataJSON.data.slice(0, offset);
			return createOutputString(paginateDataJSON);
				
		//No pagination
		} else {
			return createOutputString(dataJSON.data);
		}
		
		//Takes array of objects as argument and returns a reformatted array
    	//with fewer but more relavent properties for each image object
    	function createOutputString(imageArray) {
    		var outputArray = [];
    		
    		for (var i = 0; i < imageArray.length; i++) {
    			var imageJSON = {
    				title: imageArray[i].title,
    				topic: imageArray[i].topic,
    				description: imageArray[i].description,
    				url: imageArray[i].link
    			};
    			outputArray.push(imageJSON);
    		}
    		return outputArray;
    	}
    }
    
    //Private function takes number of days as an argument
    //Returns Date object for document expiration date
    function generateExpiration(days) {
    	if (typeof days === "number") {
    		//86,400,000 ms in one day
    		var docLifetime = days * 86400000;
			var currentUnixTime = new Date().getTime();
			return new Date(currentUnixTime + docLifetime);
    	}
    }
    
}