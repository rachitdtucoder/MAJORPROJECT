if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const ejsMate=require("ejs-mate");
const listingsRoute=require("./routes/listing.js");
const reviewsRoute=require("./routes/review.js");
const userRoute=require("./routes/user.js")
const session=require("express-session");
const MongoStore=require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const helmet = require('helmet');

const dbUrl=process.env.ATLASDB_URL;

main()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    });

async function main(){
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use('/uploads', express.static('uploads'));

const store=MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE", err);
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

// Content Security Policy configuration to allow external resources
app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],  // Allow resources only from the same origin
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://fonts.gstatic.com"],  // Allow FontAwesome and Google Fonts
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com", "https://stackpath.bootstrapcdn.com", "https://cdn.jsdelivr.net"],  // Allow inline styles
      scriptSrc: ["'self'", "https://code.jquery.com", "https://cdn.jsdelivr.net", "https://stackpath.bootstrapcdn.com"],  // Allow external scripts
      imgSrc: ["'self'", "data:", "https://cdnjs.cloudflare.com"],  // Allow images from same origin and external sources
      connectSrc: ["'self'"],  // Allow connections to the same origin
      frameSrc: ["'none'"],  // Disallow embedding the site in iframes
      objectSrc: ["'none'"],  // Disallow object embedding
      upgradeInsecureRequests: []  // Optional: Upgrade HTTP to HTTPS for all resources
    }
  }));
  



  

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

// app.get("/demouser", async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });

//     let registeredUser=await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });

app.use("/listings", listingsRoute);
app.use("/listings/:id/reviews", reviewsRoute);
app.use("/", userRoute);

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});