var express = require("express"), 
    app     = express(), 
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    passLocal = require("passport-local"),
    passLocMong = require("passport-local-mongoose"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

// require routes   
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    authRoutes = require("./routes/index");

//seedDB();
// ============
// DATABASE URL
// ============
// local url: "mongodb://localhost/yelp_camp_v12d"; (export DATABASEURL=localurl)
// mLab url: "mongodb://Joseph:connect@ds149551.mlab.com:49551/js_yelpcamp_v12"
var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v12d";
//console.log(process.env.DATABASEURL);
mongoose.connect(url);

// Use connect-flash messages
app.use(flash());

// PASSPORT CONFIG (session/cookie)
app.use(require("express-session")({
    secret: "Hawaii is tops",
    resave: false,
    saveUninitialized: false
}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

passport.use(new passLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp server has started...");
});