const mongoose=require("mongoose");

const imageSchema = new mongoose.Schema({
  url: String,
  filename: String,
});

const ListingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:[imageSchema],
    price:Number,
    location:String,
    country:String,
    reviews:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
      }
    ],
    owner: {
      type:mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    booked: { type: Boolean, default: false },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category:{
      type: String,
      enum: ["Trending", "Rooms", "Iconiccities", "Mountains", "Castles", "Amazingpools", "Camping", "Farms", "Arctic", "Boats", "Towers"],
    }
  });

const Listing=mongoose.model("Listing",ListingSchema);
module.exports=Listing;