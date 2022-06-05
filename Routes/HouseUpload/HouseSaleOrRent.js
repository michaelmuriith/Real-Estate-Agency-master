const router = require("express").Router();
const mongoose = require("mongoose");
const Formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
const House = require("../../Models/Houses");

//Initialize MongoDB connection and Cloudinary
const mongoURI = "mongodb+srv://test:NpGwpLHGdgFQHM2M@realestate.2qhqk.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(
  mongoURI,
  { 
    useCreateIndex: true,
    useNewUrlParser: true, 
    useUnifiedTopology: true
  })
  .then(() => {
    console.log(`connected to mongo db`)
  })
  .catch((error) => {
    throw new Error(error)
  });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

//ROUTE FOR USER TO COME SELL OR RENT THEIR HOUSES

router.post("/api/houseListing", async (request, response) => {
  const form = new Formidable.IncomingForm();
  form.parse(request, (error, fields, files) => {
    const {
      name,
      surname,
      idNumber,
      phoneNumber,
      email,
      province,
      street,
      sale_or_rent,
      housePrice,
      bedroomNumber,
      garages,
      pool,
      bathroomNumber,
      petFriendly,
    } = fields;

    const { houseImage } = files;

    cloudinary.uploader.upload(
      houseImage.path,
      { folder: "/properties/houseAgency" },
      async (error, results) => {
        
        const image_url = results.url;

        const newHouseListing = new House({
          owner: {
            name,
            surname,
            idNumber,
            phoneNumber,
            email,
          },
          house_location: {
            province,
            street,
          },
          house_properties: {
            sale_or_rent,
            housePrice,
            bedroomNumber,
            garages,
            pool,
            bathroomNumber,
            petFriendly,
            houseImage: image_url,
          },
        });
        const savedListing = await newHouseListing.save();
        return response.status(200).json(savedListing);
      }
    );
  });
});

module.exports = router;
// console.log("Name: ", name);
// console.log("Surname: ", surname);
// console.log("IdNUmebr: ", idNumber);
// console.log("PhoneNumber", phoneNumber);
// console.log("Emaiil: ", email);
// console.log("Province", province);
// console.log("Street", street);
// console.log("SALE OR RENT: ", sale_or_rent);
// console.log("LAND SIZE", land_size);
// console.log("BedRoomNUmber", bedroomNumber);
// console.log("Garages", garages);
// console.log("Pool", pool);
// console.log("Bathroom", bathroomNumber);
// console.log("Pet Friendly", petFriendly);
// console.log("House IMage", houseImage.path);
