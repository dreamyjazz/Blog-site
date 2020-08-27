var mongoose = require("mongoose");

var currentRead = mongoose.Schema({
	title : {type : String, required: true},
	author : {type : String, required : true},
	start : {type : String, default : Date.now},
	coverURL :{type : String, required : true},
	goodreadsURL : {type : String, required : true},
})



module.exports = mongoose.model("currentRead", currentRead);