var mongoose = require("mongoose");


//THE SCHEMA OF THE WORKS! 
var worksSchema = new mongoose.Schema({
	title : {type : String, required: true},
	createdOn : {type : String},
	coverImage : {type : String, required : true},
	details : {type : String},
	link : {type : String},
});
module.exports = mongoose.model("Works", worksSchema);