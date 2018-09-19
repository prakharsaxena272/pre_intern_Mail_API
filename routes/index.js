var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");
var Message = require("../models/message");

//root route

// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
           res.redirect("/register"); 
        });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login"); 
});
router.get("/message",middleware.isLoggedIn,  function(req, res){
   res.render("message"); 
});
//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/login",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "LOGGED YOU OUT!");
   res.redirect("/");
});



router.post("/sendmessage",middleware.isLoggedIn,function(req, res){
   //lookup campground using ID
   var subject = req.body.subject;
    var message = req.body.message;

    var from = {
        id: req.user._id,
        username: req.user.username
    };
     var newMessage = {subject : subject, text:  message, from : from}
     console.log(newMessage);
   User.findOne({username : req.body.usernameto}, function(err, user){
       if(err){
           console.log(err);
           res.redirect("/message");
       } else {
        console.log(user);
        Message.create(newMessage, function(err, message){
           if(err){
               console.log('1'  +  err);
           } else {
               //add username and id to message
               // message.from.id = req.user._id;
               // message.from.username =  ;
               //save message 
               message.save();
               user.message.push(message);
               user.save();
               console.log(message + 'sent');
               req.flash('success', 'Sent!');
               res.redirect('/' );
           }
        });
       }   
   });
});
 

router.get("/abc/:id",middleware.isLoggedIn, function(req, res){
    //find the user with provided ID
    User.findById(req.params.id).populate("message").exec(function(err, user){
        if(err){
            console.log(err);
        } else {

            console.log('here is user/n' + user);
            //render show messages with that user
            res.render("inbox", {user: user}); 
        }
    });
});

router.get("/inbox",middleware.isLoggedIn, function(req, res){
   res.render("inbox"); 
});

router.get("/", function(req, res){
    res.render("home");
});

module.exports = router;