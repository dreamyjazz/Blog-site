var express  = require("express");
var router   = express.Router();
var blogPost = require("../models/blog");
var passport = require("passport");
var mongoose 	   = require("mongoose");
var Admin = require("../models/admin");
var Works = require("../models/works");
var currentRead = require("../models/read");
var multer = require('multer');
var cloudinary = require('cloudinary');
//CONFIGURING CLOUDINARY
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})


cloudinary.config({ 
  cloud_name: 'dap7ao7fx', 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
});

//CREATING THE PAGINATION 
			function pagination(querySet, page, rows){
				var startP = (page - 1) * rows;
				var endingP = startP + rows
				var trimData = querySet.slice(startP, endingP)
				var pages = Math.ceil(querySet / rows)
				return trimData;
			}

//THE TAGS ROUTE REDIRECT
router.get("/blog/:theTag/page=:num", function(req,res){
	console.log(req.params.num)
	var thisTag = req.params.theTag.toLowerCase();
	blogPost.find({tags :{$regex : thisTag}}, function(err,docs){
		if(err){console.log(`There is an error while finding posts with the tag ${thisTag}`)}else{
			currentRead.find({}, function(err, book){
				if(err){console.log("THIS IS THE ERROR : ", err)}else{
					res.render("journal2", {
				thisTag : thisTag,
				tags : true,
				results : pagination(docs, Number(req.params.num), 3), 
				nextPage : Number(req.params.num) +1, 
				prevPage : Number(req.params.num) - 1, 
					CR : book[book.length - 1]})
				}
			})
			
		}
	})
	
})
router.get("/blog/page=:num", function(req,res){
	if(Number(req.params.num) === 0){res.send("Unavailable Page! ")}
	//GET ONLY THE BLOGPOSTS CORRESPONDING TO THE SEARCHING TERM
	if(req.query.searchBox){
		console.log(req.query.searchBox);
		 const regex = new RegExp(escapeRegex(req.query.searchBox), 'gi');
		 blogPost.find(
			 {
				 $or : [{title : { $regex: regex }}, {tags : {$regex : regex}}]
			 }, function(err, blogPosts){
		if(err){console.log("ERROR WHILE LOADING BLOG POSTS");}
		else{
			currentRead.find({}, function(err, CR){
				if(err){console.log("There's an error while fetching the current read", err)}else{
					var Current = CR[CR.length -1 ]
					res.render("journal2", {
				CR : Current,
				tags : null,
				thisTag : undefined,
				results : pagination(blogPosts, req.params.num, 4), 
				nextPage : Number(req.params.num) +1, 
				prevPage : Number(req.params.num) - 1})
			}}) } })}
		
	
else{
	//testing the async function
	
			 blogPost.find({}, function(err, blogPosts){
				 currentRead.find({}, function(err,docs2){
					 if(err){console.log("ERROR IN CURRENT Read --> Journal page ", err)}else{
						 			 var count = blogPosts.length -1;
		if(err){console.log("ERROR WHILE LOADING BLOG POSTS");}
		else{
			res.render("journal2", {
				CR : docs2[docs2.length -1],
				thisTag : undefined,
				tags : false,
				results : pagination(blogPosts, req.params.num, 4), 
				nextPage : Number(req.params.num) +1, 
				prevPage : Number(req.params.num) - 1})
		}
					 }
				 })
	 
		})
	
}
	
})
//Show route
router.get("/blog/:id", function(req,res){
	blogPost.findById(req.params.id, function(err, foundBlog){
		if(err){
			console.log("There is an err while showing the blogpost, ", err)
			res.redirect("/")}
		else{
	//generate a random post 
		blogPost.find({}, function(err, docs){
		if(err){console.log("COULD NOT FIND RELATED BLOG POST")}
			else{ 
			currentRead.find({}, function(err,docs2){
			if(err){console.log("ERROR!!!! : ", err)}else{
				
		var related = Math.floor(Math.random() * docs.length);		
		console.log(related)
		res.render("blog-single", { CR : docs2[docs2.length -1],foundBlog: foundBlog, title : foundBlog.title, related : docs[related]})
			} })
			}		
		})
	
		 	
		 }
	})
})
//Route ==> All posts on editing page
router.get("/admin/edit/page=:num", IsAdminLoggedIn, function(req,res){
	blogPost.find({}, function(err, docs){
		if(err){console.log("There is an error while loading posts on the editing route ", err)}else{
		
			res.render("edit-posts",{docs : pagination(docs, req.params.num, 4), nextPage : Number(req.params.num) +1, prevPage : Number(req.params.num) - 1});
		}
	})
})


/*THE EDITING ROUTE*/
router.get("/admin/blog/:id/edit", IsAdminLoggedIn,function(req,res){
	blogPost.findById(req.params.id, function(err, foundBlog){
		if(err){console.log("ERROR DUE TO : ", err)}else{
		console.log("this is the editing ROUTEE", foundBlog)
		res.render("edit-one-post",  {foundBlog : foundBlog,})
		}})

})



// THE ADMIN SECTION ===============================================================
//ADDITIONAL FUNCTIONS ======================================================================
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

function creatBlogPost(BlogObject){

	var allTags = BlogObject.tags.split(",");
	console.log(allTags);
	var post = new blogPost({
		postSummary : BlogObject.postSummary,
		title : BlogObject.title,
		tags  : allTags,
		lang : BlogObject.lang,
		blogPhoto : BlogObject.blogPhoto,
		author: "Ikram M.",
		createdAt : getDate(),
		blogBody : BlogObject.blogBody
	})
	post.save(function(err, blogPost){
		if(err){console.log("Something went WHILE ADDING BLOG POST INTO THE DATABASE wrong due to :", err)}
		else{console.log("succesfuly added into the data base! \n here's the new post", blogPost)}
	});}															  
//===================================================================================

//UPDATE THE EDITING POST 
router.put("/blogs/:id", function(req,res){
	blogPost.findByIdAndUpdate(req.params.id, req.body.Blog, function(err, updatedBlogPost){
		if(err){console.log("ERROR WHLE UPDATING : ", err)}else{
		console.log("UPDATED SUCCESFULLY")
			res.redirect(`/blog/${req.params.id}`)
		}
	})
})


/*THE DELETE ROUTE */
router.delete("/blogs/:id", function(req,res){
	console.log(req.params.id);
	blogPost.findByIdAndRemove(req.params.id, function(err){
		if(err){console.log("THERE IS AN ERROR WHILE DELETING BLOGPOST")}
	else{console.log("POST DELETED SUCCESFULLY!")
	res.redirect("/")}
	})
})
//ROUTE ===> CREATE A NEW BLOG POST!!!
 router.get("/admin/dashboard",IsAdminLoggedIn,function(req,res){
   res.render("admin-dashboard")});

//POSTING ROUTE ===> APPENDING THE POST INTO THE DATABASE !!
router.post("/blogs", function(req,res){
	//creating the Blog Post , get data from request 
	creatBlogPost(req.body.Blog);
	console.log(req.body.Blog._id);
	
	//redirecting to Home page
	res.redirect("/");
	
})
//REGISTERING ADMIN DATA LOGIC
router.get("/admin/register", function(req,res){
	res.render("admin-register");
})
router.post("/admin/register", function(req,res){
	Admin.find({},function(err, docs){
		if(err){console.log(err);}
		else if(docs.length === 1){res.send("cannot have multiple admins!")}
		else{		   
			var newAdmin = new Admin({username : req.body.username})
			Admin.register(newAdmin, req.body.password, function(err,admin){
		if(err){
				console.log("did not work", err);
			   	return res.redirect("/admin/register")}
			passport.authenticate("local")(req,res, function(){
				res.redirect("/")});
				})
		}
		   }) });
//LOGING IN FOR THE ADMIN
router.get("/admin/login", function(req,res){
	res.render("admin-login");
})
router.post("/admin/login", passport.authenticate("local", {
	successRedirect : "/admin/dashboard",
	failureRedirect : "/admin/login"}),function(req,res){})


//ROUTE ==> THE ADD A NEW WORK PAGE
router.get("/admin/works", IsAdminLoggedIn,function(req,res){
	res.render("add-work");
})

//Routes ===> adding the works into the database and posting to the database
router.post("/admin/works",IsAdminLoggedIn, upload.single('image'),function(req,res){
	cloudinary.uploader.upload(req.file.path, function(result) {
		
  // add cloudinary url for the image to the campground object under image property
  req.body.work.coverImage = result.secure_url; 
	console.log(req.body);
		  Works.create(req.body.work, function(err, docs){
    if (err) {
     console.log("error : ", err);
    }else{
	res.redirect("/"); }
  });
})
} );


//LOG OUT ROUTE THE ADMIN
router.get("/admin/logout", function(req,res){
	req.logout();
	res.redirect("/");
})
//==============================================================================
//REGEX FUNCTION
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
//CHECKING IF THE ADMIN IS LOGGED IN 
function IsAdminLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	return res.redirect("/admin/login");
}
module.exports = router;