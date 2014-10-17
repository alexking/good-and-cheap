/**
 * Recipes.js
 */ 

var Recipes = { };

/**
 * Default properties
 */
Recipes.baseUrl = "/recipes";

/**
 * Provides your callback with a list of recipes
 */
Recipes.list = function(callback) {
	$.get(this.indexUrl(), function(data) {
		callback(data);	
	}, "json");
};

Recipes.get = function(key, callback) {
	return new Recipe(key, callback);
};

/**
 * URL Helpers 
 */
Recipes.indexUrl = function() {
	return this.url("json/_index.json");
};

Recipes.recipeUrl = function(key) {
	return this.url("json/" + key + ".json");
};

Recipes.url = function(api) {
	return this.baseUrl + "/" + api; 
};

/**
 * Recipe object
 */
var Recipe = function(data) {
	var self = this; 

	$.extend({
		title : "",
		description : "",
		ingredients : [],
		instructions : ""
	}, data);

	$.each(data, function(key, value) {
		self[key] = value;
	});

};

/**
 * Provides callback with a Recipe object 
 * @param  string   key
 * @param  function callback
 * @return Recipe
 */
Recipe.get = function(key, callback) {
	$.get(Recipes.recipeUrl(key), function(data) {
		callback(new Recipe(data));
	}, "json");
};

Recipe.prototype.title = function() {
	this.properties("title"); 
};
