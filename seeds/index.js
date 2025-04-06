const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Hotspot = require("../models/hotspot");
const prices = ["free", "cheap", "moderate", "expensive"];

mongoose.connect("mongodb://localhost:27017/plan-my-trip");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Hotspot.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const spot = new Hotspot({
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      // Developer User ID
      author: "67e3f61ba4ffdbd9e536f4da",
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/dz1odp1yw/image/upload/v1743836321/PlanMyTrip/nbxcfsanpdtk4tcvlz97.jpg",
          filename: "PlanMyTrip/nbxcfsanpdtk4tcvlz97",
        },
        {
          url: "https://res.cloudinary.com/dz1odp1yw/image/upload/v1743836322/PlanMyTrip/nrkbe6rrnok2xecypjah.jpg",
          filename: "PlanMyTrip/nrkbe6rrnok2xecypjah",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo officia id commodi error porro ipsam, facilis sunt tenetur et voluptas nihil, quas cupiditate libero, nostrum ea beatae perferendis. Earum, commodi?",
      price: prices[Math.floor(Math.random() * prices.length)],
    });
    await spot.save();
  }
};

seedDB().then(() => {
  db.close();
});
