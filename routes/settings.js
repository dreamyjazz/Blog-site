var express  = require("express");
var router   = express.Router();
var blogPost = require("../models/blog");
var passport = require("passport");
var mongoose 	   = require("mongoose");
var Admin = require("../models/admin");
var currentRead = require("../models/read");


//ADDITIONAL FUNCTIONSSS==================================================
const nth = function(d) {
  if (d > 3 && d < 21) return 'th';
  switch (d % 10) {
    case 1:  return "st";
    case 2:  return "nd";
    case 3:  return "rd";
    default: return "th";
  }
}

function getDate(){
	var currentDate = new Date();
const month = currentDate.toLocaleString('default', { month: 'long' });
var date = month+ " "+ currentDate.getDate()+nth(currentDate.getDate())+", "+currentDate.getFullYear();
return date;
}
//FUNCTION TO CREATE THE CURRENT READING BOOK AND SAVE IT TO THE DB======
function creatCurrentRead(BookObject){
	
	var currentReadBook = new currentRead({
		title : BookObject.title,
		author : BookObject.author,
		coverURL : BookObject.coverURL,
		start : getDate(),
		goodreadsURL : BookObject.goodreadsURL

	})
	currentReadBook.save(function(err, docs){
		if(err){console.log("Something went WHILE ADDING THE CURRENTLY READING BOOK INTO THE DATABASE wrong due to :", err)}
		else{console.log("succesfuly added into the data base! \n here's the Book", blogPost)}
	});}
//=======================================================================


//CREATING THE CURRENT READ ROUTE 
router.get("/admin/update-current-read",IsAdminLoggedIn, function(req,res){
	res.render("currently-reading");
})

//Posting TO THE CURRENT READ ROUTE AND SAVING DATA TO THE DATABASE
router.post("/admin/update-current-read", function(req,res){
	creatCurrentRead(req.body.Book);
	res.redirect("/admin/dashboard");
	
	
})

//Creating the comments and appending them into the comment section 






























//CHECKING IF THE ADMIN IS LOGGED IN 
function IsAdminLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	return res.redirect("/admin/login");
}

module.exports = router;