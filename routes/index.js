var express = require("express");
var router = express.Router();
var Admin = require("../models/admin");
var blogPost = require("../models/blog");
var passport = require("passport");
var mongoose 	   = require("mongoose");
var Works = require("../models/works");
var currentRead = require("../models/read");


//ROUTE ==> GET THE LANDING PAGE
router.get("/",function(req, res){
var allTags = ["Art", "Writing", "Tech", "Cinema & shows", "Other"];
	
	blogPost.find({}, function(err, blogPosts){
	if(err){
	console.log("something went wrong due to : ", err)}
	else{
		currentRead.find({}, function(err, docs){
			if(err){console.log("there's an error while finding the works")}else{
			Works.find({}, function(err, docs2){
			
				Count = blogPosts.length
		console.log("Total number of posts is ",Count)
	res.render("index2", {blogPosts : blogPosts,
						  Count : Count,
						 CR : docs[docs.length - 1],
						 works : docs2,})
			})
		
		} 
		}) 
	  } 
		} 
	)} 
)

/*ROUTE ==> THE ABOUT ME PAGE */
router.get("/about", function(req,res){
	res.render("about-me", {title : "More About me"});})


//ROUTE ==> ERROR CATCING PAGE 
router.get("*", function(req,res){
	res.render("error");
})



//CHECKING IF THE ADMIN IS LOGGED IN 
function IsAdminLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/admin/login");
}

module.exports = router;