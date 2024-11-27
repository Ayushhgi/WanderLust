if(process.env.NODE_ENV !="production"){
  require("dotenv").config(); 
}


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const ExpressError = require('./utils/expressError.js');
const session = require('express-session');
const MongoStore= require('connect-mongo');
const flash = require('connect-flash');
const passport = require ("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");




const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require('./routes/user.js');
const { error } = require("console");

const dbUrl=process.env.ATLASDB_URL;


main()
  .then(() => {
    console.log('connected to DB')
  })
  .catch(err => {
    console.log(err)
  })

async function main () {
  await mongoose.connect(dbUrl)
}

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.engine('ejs', engine)
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static('public'))


const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
},
touchAfter:24*3600,

});

store.on("error",(err)=>{
  console.log("ERROR IN MONGO SESSION STORE",err)
})

const sessionOptions= {
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expire: Date.now()+ 1000*60*60*24*3,
    maxAge: 1000*60*60*24*3,
    httponly: true,
  },
};

app.use(session(sessionOptions)); 
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req , res, next)=>{
res.locals.success =req.flash("success");
res.locals.error =req.flash("error");
res.locals.currUser =req.user;
next();
});



app.use("/listings", listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/", userRouter);


app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found!"));
})

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  err.message = message; // Ensure the error object has a message property
  res.status(statusCode).render("error", { err });
});


app.listen(8001, () => {
  console.log('server is listening at the port 8001')
})
