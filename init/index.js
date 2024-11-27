const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
// const { appendFile } = require("fs");


main()
  .then(() => {
    console.log('connection successful')
  })
  .catch(err => {
    console.log(err)
  })

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
}

const initDB = async () =>{
    await Listing.deleteMany({});

    initData.data =initData.data.map((o)=>({...o,owner:'673027759ca670ba3e8edc75'}))
    await Listing.insertMany(initData.data);
    console.log("Data is initialized");
}
initDB();
