const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, isOwner, validateListing } = require('../middleware');
const listingController = require('../controller/listings');
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });

// Routes for listings

router
.route('/')
.get(wrapAsync(listingController.index)) // Index route
.post(
  isLoggedIn,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.createListing)
); // Create route


router
  .route('/new')
  .get(isLoggedIn, wrapAsync(listingController.renderNewForm)); // New form route

router
  .route('/:id')
  .get(wrapAsync(listingController.showListing)) // Show route
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing)
  ) // Update route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)); // Delete route

router
  .route('/:id/edit')
  .get(isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm)); // Edit form route

module.exports = router;
