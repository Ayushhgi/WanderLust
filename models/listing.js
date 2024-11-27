const mongoose = require('mongoose')
const Schema = mongoose.Schema
const review = require('./reviews.js')


const listingSchema = new Schema({
  title: {
    type: String,
    required: true
  },

 image: {
  // type: String, // Simplified as a single string
  // default:
  //   'https://unsplash.com/photos/a-couple-of-people-standing-on-top-of-a-beach-under-a-cloudy-sky-_Owl5k__7Qw',
  // set: (v) =>
  //   v === ''
  //     ? 'https://unsplash.com/photos/a-couple-of-people-standing-on-top-of-a-beach-under-a-cloudy-sky-_Owl5k__7Qw'
  //     : v,
  url:String,
  filename:String,
}
,
  description:String,
  price: Number,
  location: String,
  country: String,

  reviews : [{
    type:Schema.Types.ObjectId,
    ref:"Review",
  }],

  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  }
})


listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await review.deleteMany({_id:{$in:listing.reviews}});
  }
})



const Listing = mongoose.model('Listing', listingSchema)
module.exports = Listing
