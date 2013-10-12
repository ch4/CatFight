
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.define("getPic", function(request, response) {
	var payload;
	var query;
	query = new Parse.Query("Pictures");
  query.descending("updatedAt");
  query.limit(5);
  query.first().then(function(result) {
	  // only the selected fields of the object will now be available here.
	  console.log("got pic");
	  console.log(result);
	  return result.fetch();
	}).then(function(result) {
	  // all fields of the object will now be available here.
	  payload = { "picId" : result.id, "picUrl" : result.get("URL") };
	  console.log(result);
	  response.success(payload);
	});


});

Parse.Cloud.define("submitRating", function(request, response) {
	var id = request.params.picId;
	var rating = request.params.rating;
	var query;
	query = new Parse.Query("Pictures");
	query.fetch(id).then(function(result) {
		result.increment("totalViews");
		if(rating == "up") result.increment("rating");
		result.save();
	});
  response.success("success");
});