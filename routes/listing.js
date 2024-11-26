const express=require("express");
const router= express.Router();
const Listing=require("../models/listing.js");
const User=require("../models/user.js");
const {isLoggedIn, loadNotification}=require("../middleware.js");
const review = require("../models/review.js");
const { cloudinary, storage } = require("../cloudConfig.js"); // Import Cloudinary storage
const multer = require("multer");
// Set up multer with Cloudinary storage
const upload = multer({ storage }); // Use Cloudinary storage from cloudConfig.js

// index route
// Route to fetch all listings or filtered listings
router.get("/", async (req, res) => {
    const category = req.query.category; // Check if a category is passed as a query parameter
    const searchQuery = req.query.country; // Check for search query
    try {
        let allListings = []; // Initialize as an empty array to ensure it's iterable

        if (category) {
            // If category exists, filter listings by category
            allListings = await Listing.find({ category });
        } else if (searchQuery) {
            // If searchQuery exists, filter listings by country
            allListings = await Listing.find({ country: searchQuery });
        } else {
            // Default: get all listings
            allListings = await Listing.find({});
        }

        // Render the listings page
        res.render("listings/index.ejs", { allListings });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

// new route
router.get("/new", isLoggedIn, (req,res)=>{
    res.render("listings/new.ejs");
});
// show route
router.get("/:id", async (req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
         populate:{
            path: "author",
        },
    })
    .populate('owner');
    console.log(listing);
    res.render("listings/show.ejs", {listing});
});
// create route
router.post("/",upload.array("image", 10), async (req,res)=>{
    let {title,description,image,price,country,location,category}=req.body;
    if (!title) {
        console.error("Title is missing!");
        return res.status(400).send("Title is required.");
    }
    const imagePaths = req.files.map(file =>({ url: file.path, filename:file.filename}));
    console.log(imagePaths);
    let newListing=new Listing({
        title,
        description,
        image:imagePaths,
        price,
        country,
        location,
        category,
    });
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
});

// edit route
router.get("/:id/edit",  isLoggedIn, async (req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});
router.post("/:id", upload.array("newImages", 10), async (req, res) => {
    let { id } = req.params;
    let { title, description, price, country, location } = req.body;
  
    try {
      // Get existing images from hidden fields
      const existingImages = Array.isArray(req.body.existingImages)
        ? req.body.existingImages
        : req.body.existingImages
        ? [req.body.existingImages]
        : []; // Initialize as empty array if no existing images
  
      // Map new uploaded images to get their url and filename
      const newImagePaths = req.files && req.files.length > 0
        ? req.files.map(file => ({
            url: file.secure_url || file.path, // Use secure_url for Cloudinary or fallback to local path
            filename: file.filename
          }))
        : [];
  
      // Combine existing and new images
      const allImages = [...existingImages, ...newImagePaths];
  
      // Update the listing with combined images
      const updatedListing = await Listing.findByIdAndUpdate(id, {
        title,
        description,
        image: allImages,
        price,
        country,
        location,
      }, { new: true });
  
      req.flash("success", "Listing Updated!");
      res.redirect(`/listings/${updatedListing._id}`);
    } catch (err) {
      console.error("Error updating listing:", err);
      req.flash("error", "Something went wrong while updating the listing.");
      res.redirect(`/listings/${id}`);
    }
  });
  

// delete route
router.post("/:id/delete", isLoggedIn, async (req,res)=>{
    let {id}=req.params;
    await Listing .findByIdAndDelete(id);
    req.flash("success", " Listing Deleted!");
    res.redirect("/listings");
});

router.post('/:id/book' ,isLoggedIn, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        // Check if the listing is already booked
        if (listing.booked) {
            req.flash('error', 'Property already booked.');
            return res.redirect(`/listings/${listing._id}`);
        }

        // Mark the listing as booked
        listing.booked = true;
        listing.bookedBy = req.user._id; 
        await listing.save();

        // Flash message for the user who booked the listing
        req.flash('success', 'Property successfully booked.');

        // Redirect to the listing page
        res.redirect(`/listings/${listing._id}`);
    } catch (error) {
        console.error("Error booking the listing:", error); // Log the actual error
        res.redirect(`/listings/${req.params.id}`);
    }
});
router.get('/:id/book', isLoggedIn, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        // Check if the listing is already booked
        if (listing.booked) {
            req.flash('error', 'Property already booked.');
            return res.redirect(`/listings/${listing._id}`);
        }
        res.redirect(`/listings/${listing._id}`);
    } catch (error) {
        console.error("Error handling GET /book:", error);
        res.redirect(`/listings/${req.params.id}`);
    }
});

module.exports=router;