const express=require("express");
const router= express.Router();
const passport=require("passport");
const Listing = require("../models/listing.js");
const Booked = require("../models/booked.js");
const User=require("../models/user.js");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",async(req,res)=>{
    try{
        let {username, email, password, role}=req.body;
        // if (!['student', 'recruiter'].includes(role)) {
        //     req.flash('error', 'Invalid role selected.');
        //     return res.redirect('/signup');
        // }
        const newUser=new User({
        username,
        email,
        role
    });
    const registeredUser=await User.register(newUser, password);
    console.log(registeredUser);
    res.redirect("/login");
    // if(role=='user'){
    // req.login(registeredUser,(err)=>{
    //     if(err) return next(err);
    //     req.flash("success", "Welcome to Wanderlust");
    //     res.redirect("/listings");
    // });
    // }
    // else{
    //     req.login(registeredUser,(err)=>{
    //         if(err) return next(err);
    //         req.flash("success", "Welcome to Wanderlust");
    //         const listings = Listing.find({ owner: registeredUser._id });
    //         res.render("admin/admin.ejs", { listings });
    //     });
    // }
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
});

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    let { role } = req.body;

    if (role === 'user') {
        req.flash("success", "Welcome back to Wanderlust!");
        res.redirect("/listings");
    } else {
        req.flash("success", "Welcome back to Wanderlust!");
        const listings = await Listing.find({ owner: req.user._id });
        res.locals.currUser = req.user; // Ensure currUser is set explicitly if needed
        res.render("admin/admin.ejs", { listings }); // Render the admin page
    }
});

router.get("/profile", async (req, res) => {
    if (!req.isAuthenticated()) {
      req.flash("error", "You must be logged in to view your profile.");
      return res.redirect("/login");
    }
  
    try {
      // Fetch user's bookings
      const bookings = await Booked.find({ applicant: req.user._id }).populate("listing");
      res.render("users/profile.ejs", { bookings });
    } catch (err) {
      console.error(err);
      req.flash("error", "Failed to load profile.");
      res.redirect("/listings");
    }
});

  

router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            console.log("Error during logout", err);
        }
        req.flash("success", "Logged out successfully!");
        // Ensure the redirect here is not appending anything unintended to the URL
        res.redirect("/listings");
    });
});



module.exports=router;