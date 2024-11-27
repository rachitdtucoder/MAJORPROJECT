const express=require("express");
const router= express.Router();
const passport=require("passport");
const User=require("../models/user.js");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",async(req,res)=>{
    try{
        let {username, email, password}=req.body;
        const newUser=new User({
        email,
        username
    });
    const registeredUser=await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err) return next(err);
        req.flash("success", "Welcome to Wanderlust");
        res.redirect("/");
    });
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
});

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",saveRedirectUrl , passport.authenticate("local",{failureRedirect:'/login', failureFlash: true }), async(req, res)=>{
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl=res.locals.redirectUrl || "/";  
    const method = req.session.method 
    // If the original request was a POST request, redirect to a helper route
    if (method === "POST") {
        return res.redirect("/helper-post");
    }
    res.redirect(redirectUrl);
});

router.get("/please/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            console.log("Error during logout", err);
        }
        req.flash("success", "Logged out successfully!");
        // Ensure the redirect here is not appending anything unintended to the URL
        res.redirect("/");
    });
});



module.exports=router;