var mongoose = require("mongoose");

var CommentSchema = new mongoose.Schema({
	username : {type : String},
	email : {type :String, required : true},
	comment : {type : String, required : true},
	postDate : {type : String},
})










module.exports = mongoose.model("Admin", AdminSchema);