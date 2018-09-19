var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
    flash        = require("connect-flash"),
    Message     = require("./models/message"),
    User        = require("./models/user"),
    session = require("express-session"),
   
    methodOverride = require("method-override");
    
//requiring routes

var indexRoutes      = require("./routes/index");
    
mongoose.connect("mongodb://localhost/cashpositive");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));



// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Smartness Overloaded",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});


app.use("/", indexRoutes);


app.listen(2611, function(){
   console.log("Startted");
});
