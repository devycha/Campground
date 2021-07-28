const mongoose = require("mongoose");
const cities = require("./cities");
const Campground = require("../models/campground");
const { places, descriptors } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/campground", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("dbs connected");
});
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];
const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 10; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20 + 10);
    const camp = new Campground({
      author: "60fc2fbf7e28b25614c00101",
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: `https://source.unsplash.com/collection/483251`,
      description: "Lorem ipsum dolor sit amet",
      price: price,
      images: [
        {
          url: "https://res.cloudinary.com/dnn6fwty6/image/upload/v1627314225/hg4vwkols2ucifajpsib.png",
          filename: "hg4vwkols2ucifajpsib",
        },
        {
          url: "https://res.cloudinary.com/dnn6fwty6/image/upload/v1627314224/xumeuv1xqth9ax5sqksw.png",
          filename: "xumeuv1xqth9ax5sqksw",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
