const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const { isLoggedIn, loadNotification } = require("../middleware.js");
const review = require("../models/review.js");
const { cloudinary, storage } = require("../cloudConfig.js"); // Import Cloudinary storage
const multer = require("multer");

// Set up multer with Cloudinary storage
const upload = multer({ storage }); // Use Cloudinary storage from cloudConfig.js

// Index Route (for fetching all listings)
router.get("/", async (req, res) => {
    const category = req.query.category; // Check if a category is passed as a query parameter
    const searchQuery = req.query.country; // Check for search query
    let allListings = []; // Initialize as an empty array to ensure it's iterable

    if (category) {
        allListings = await Listing.find({ category }); // Filter by category
    } else if (searchQuery) {
        allListings = await Listing.find({ country: searchQuery }); // Filter by country
    } else {
        allListings = await Listing.find({}); // Default: get all listings
    }

    res.render("listings/index.ejs", { allListings }); // Render the listings page
});

// Show Route (for a single listing)
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" },
        })
        .populate("owner");

    res.render("listings/show.ejs", { listing });
});

// New Listing Form Route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

// Create Listing Route
router.post("/", isLoggedIn, upload.array("image", 10), async (req, res) => {
    const { title, description, price, country, location, category } = req.body;

    if (!title) {
        console.error("Title is missing!");
        return res.status(400).send("Title is required.");
    }

    const imagePaths = req.files.map((file) => ({ url: file.path, filename: file.filename }));
    const newListing = new Listing({
        title,
        description,
        image: imagePaths,
        price,
        country,
        location,
        category,
        owner: req.user._id,
    });

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
});

// Edit Listing Route
router.get("/:id/edit", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});

// Update Listing Route
router.post("/:id", upload.array("newImages", 10), async (req, res) => {
    const { id } = req.params;
    const { title, description, price, country, location } = req.body;

    try {
        const existingImages = Array.isArray(req.body.existingImages)
            ? req.body.existingImages
            : req.body.existingImages
            ? [req.body.existingImages]
            : [];

        const newImagePaths =
            req.files && req.files.length > 0
                ? req.files.map((file) => ({
                      url: file.secure_url || file.path,
                      filename: file.filename,
                  }))
                : [];

        const allImages = [...existingImages, ...newImagePaths];

        const updatedListing = await Listing.findByIdAndUpdate(
            id,
            {
                title,
                description,
                image: allImages,
                price,
                country,
                location,
            },
            { new: true }
        );

        req.flash("success", "Listing Updated!");
        res.redirect(`/listings/${updatedListing._id}`);
    } catch (err) {
        console.error("Error updating listing:", err);
        req.flash("error", "Something went wrong while updating the listing.");
        res.redirect(`/listings/${id}`);
    }
});

// Delete Listing Route
router.post("/:id/delete", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
});

// Booking Route (for booking a listing)
router.post("/:id/book", isLoggedIn, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (listing.booked) {
            req.flash("error", "Property already booked.");
            return res.redirect(`/listings/${listing._id}`);
        }

        listing.booked = true;
        listing.bookedBy = req.user._id;
        await listing.save();

        req.flash("success", "Property successfully booked.");
        res.redirect(`/listings/${listing._id}`);
    } catch (error) {
        console.error("Error booking the listing:", error);
        res.redirect(`/listings/${req.params.id}`);
    }
});

router.get("/:id/book", isLoggedIn, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (listing.booked) {
            req.flash("error", "Property already booked.");
            return res.redirect(`/listings/${listing._id}`);
        }

        res.redirect(`/listings/${listing._id}`);
    } catch (error) {
        console.error("Error handling GET /book:", error);
        res.redirect(`/listings/${req.params.id}`);
    }
});

module.exports = router;

