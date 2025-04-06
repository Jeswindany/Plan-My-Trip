const Hotspot = require("../models/hotspot");

const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const hotspots = await Hotspot.find({});
  res.render("hotspots/index", { hotspots });
};

module.exports.renderNewForm = (req, res) => {
  res.render("hotspots/new");
};

module.exports.createHotspot = async (req, res) => {
  const geoData = await maptilerClient.geocoding.forward(
    req.body.hotspot.location,
    { limit: 1 }
  );
  const hotspot = new Hotspot(req.body.hotspot);
  hotspot.geometry = geoData.features[0].geometry;
  hotspot.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  hotspot.author = req.user._id;
  await hotspot.save();
  req.flash("success", "Successfully added a new Hotspot!");
  res.redirect(`hotspots/${hotspot._id}`);
};

module.exports.showHotspot = async (req, res) => {
  const hotspot = await Hotspot.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!hotspot) {
    req.flash("error", "Cannot find Hotspot!");
    return res.redirect("/hotspots");
  }
  res.render("hotspots/show", { hotspot });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const hotspot = await Hotspot.findById(id);
  if (!hotspot) {
    req.flash("error", "Cannot find Hotspot!");
    return res.redirect("/hotspots");
  }
  res.render("hotspots/edit", { hotspot });
};

module.exports.updateHotspot = async (req, res) => {
  const { id } = req.params;
  const hotspot = await Hotspot.findByIdAndUpdate(id, {
    ...req.body.hotspot,
  });
  const geoData = await maptilerClient.geocoding.forward(
    req.body.hotspot.location,
    { limit: 1 }
  );
  hotspot.geometry = geoData.features[0].geometry;
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  hotspot.images.push(...imgs);
  await hotspot.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await hotspot.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated Hotspot!");
  res.redirect(`/hotspots/${hotspot._id}`);
};

module.exports.deleteHotspot = async (req, res) => {
  const { id } = req.params;
  await Hotspot.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted Hotspot!");
  res.redirect("/hotspots");
};
