var express  	   = require("express"),
	passport 	   = require("passport"),
	mongoose 	   = require("mongoose"),
 	blogPost 	   = require("./models/blog"),
	works     	   = require("./models/works"),
 	methodOverride = require("method-override"),
 	app 		   = express(),
 	bodyParser     = require("body-parser"),
	LocalStrategy  = require("passport-local"),
	Admin 		   = require("./models/admin"),
 	path 		   = require("path"),
	multer = require('multer'),
	cloudinary = require('cloudinary');
require('dotenv').config();

//REQUIRING THE ROUTE FILES 
var blogsRoute = require("./routes/blogs"),
	otherRoute = require("./routes/index"),
	settingsRoute = require("./routes/settings");
//app Configuration 
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname, "views")));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
mongoose.set('useFindAndModify', false);
mongoose.connect(`mongodb+srv://dreamycodes:${process.env.ATLASPASSWORD}@cluster0.fpqpb.mongodb.net/<dbname>?retryWrites=true&w=majority`, {
	
	useCreateIndex : true, 
	useUnifiedTopology:true,
    useNewUrlParser: true 
}).then(()=>{console.log("succesfully connected the cloud ATLAS DATABASE")})
.catch((err)=>{console.log("failed to connect to the CLOUD ATLAS database :" ,err.message)});

/*mongoose.connect("mongodb://localhost/blogposts",  {
    useUnifiedTopology:true,
    useNewUrlParser: true })	
    .then(function(){
        console.log("connected to the database");
    })
    .catch(function(err){

        console.log("Failed to connect due to : ", err);
    });*/

//PASSPORT CONFIGURATION 
app.use(require("express-session")({
	secret : "a secret",
	resave : false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Admin.authenticate()))
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

app.get("/work", function(req,res){

})

app.use(settingsRoute)
app.use(blogsRoute);
app.use(otherRoute);


//listening on the localhost port
//Before pushing to heroku make sure you use this --> process.env.PORT
app.listen(3001, function(){
    console.log("THE BLOG SERVER HAS STARTED ON PORT 3000!! ");})