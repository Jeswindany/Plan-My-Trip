const express = require("express");
const router = express.Router();
const hotspots = require("../controllers/hotspots.js");
const catchAsync = require("../utils/catchAsync.js");

const Hotspot = require("../models/hotspot");
const { isLoggedIn, isAuthor, validateHotspot } = require("../middleware.js");

const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(hotspots.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateHotspot,
    catchAsync(hotspots.createHotspot)
  );

router.get("/new", isLoggedIn, hotspots.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(hotspots.showHotspot))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateHotspot,
    catchAsync(hotspots.updateHotspot)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(hotspots.deleteHotspot));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(hotspots.renderEditForm)
);

module.exports = router;
