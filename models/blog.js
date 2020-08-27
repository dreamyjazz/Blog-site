var mongoose = require("mongoose");



//the schema of the blog posts
 var blogPostSchema = new mongoose.Schema({
	 postSummary : {type : String, required : true},
     title : {type: String},
	 tags : [{type : String, lowercase: true}],
	 lang : {type : String},
     blogPhoto : {type : String, required : true},
     author : {type : String, required : true},
     createdAt : { type: String, default: Date.now },
	 postDate : {type : Date, default : Date.now},
     blogBody : {type : String}
 }) 
module.exports = mongoose.model("blogPost", blogPostSchema);