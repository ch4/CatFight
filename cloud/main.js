
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.define("getPic", function(request, response) {
	var payload;
	var query;
	query = new Parse.Query("Pictures");
  query.ascending("updatedAt");
  query.limit(5);
  // query.first().then(function(result) {
	  // // only the selected fields of the object will now be available here.
	  // //console.log("got pic");
	  // //console.log(result);
	  // return result.fetch();
	// }).then(function(result) {
	  // // all fields of the object will now be available here.
	  // payload = { "picId" : result.id, "picUrl" : result.get("URL") };
	  // //console.log(result);
	  // response.success(payload);
	// });
	query.find({
	  success: function(results) {
		//alert("Successfully retrieved " + results.length + " scores.");
		// Do something with the returned Parse.Object values
		//for (var i = 0; i < results.length; i++) { 
		  var object = results[Math.floor((Math.random()*results.length))];
		  payload = { "picId" : object.id, "picUrl" : object.get("URL") };
		  console.log(object);
		  response.success(payload);
		  //alert(object.id + ' - ' + object.get('playerName'));
		//}
	  },
	  error: function(error) {
	  response.error(error);
		//alert("Error: " + error.code + " " + error.message);
	  }
	});


});

Parse.Cloud.define("submitRating", function(request, response) {
	var id = request.params.picId;
	var rating = request.params.rating;
	var query;
	query = new Parse.Query("Pictures");
	query.get(id).then(function(result) {
		result.increment("totalViews");
		if(rating == "up") result.increment("rating");
		result.save().then(function(result) {
		response.success("success");
		});
	});

});

Parse.Cloud.define("fight", function(request, response) {
	var user = request.params.user;

	var query;
	query = new Parse.Query("Users");
	query.count({
  success: function(count) {
    // The count request succeeded. Show the count
    return count;
	//alert("Sean has played " + count + " games");
  },
  error: function(error) {
    // The request failed
  }
}).then(function(count) {
	query.skip(Math.floor((Math.random()*count)));
	query.first().then(function(result) {
	  // only the selected fields of the object will now be available here.
	  //console.log("got pic");
	  //console.log(result);
	  return result.fetch();
	}).then(function(result) {
	  // all fields of the object will now be available here.
	  //payload = { "picId" : result.id, "picUrl" : result.get("URL") };
	  //console.log(result);
	  var Pictures = Parse.Object.extend("Pictures");
      var picQuery = new Parse.Query(Pictures);
	  picQuery.equalTo("owner", result);
	  picQuery.find({
        success: function(pics) {
	      var rating = 0;
	      for (var j = 0; j < pics.length; j++) {
	        var pic = pics[j];
	    	  rating += pic.get("rating")/pic.get("totalViews");
			}
			return rating;
		},
		error: function(error) {
			response.error(error);
		}
	  }).then(function(total) {
		  var Pictures = Parse.Object.extend("Pictures");
		  var picQuery = new Parse.Query(Pictures);
		  picQuery.equalTo("owner", user);
		  picQuery.find({
			success: function(pics) {
			  var rating = 0;
			  for (var j = 0; j < pics.length; j++) {
				var pic = pics[j];
				  rating += pic.get("rating")/pic.get("totalViews");
				}
				response.success(total + " " + rating);
				//return rating;
			},
			error: function(error) {
				response.error(error);
			}
			});
	  });
	});
});
