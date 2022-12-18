const mongoCollections = require('../config/mongoCollections');
const cars = mongoCollections.cars;
const {ObjectId} = require('mongodb');
const validation = require('../validation');
const createCar = async (
    carType,
    currentLocation,
    brand,
    model,
    costPerHour,
    availability
  ) => {
    if (!carType || !currentLocation || !brand || !model || !costPerHour || !availability){
        throw 'All fields need to have valid values';
      }
      //validating if they are all string
      validation.checkString(carType, 'The CarType');
      validation.checkString(currentLocation, 'The Current Location');
      validation.checkString(brand, 'The Brand');
      validation.checkString(model, 'The Model');
      validation.checkString(costPerHour, 'The Cost/hr');
      validation.checkString(availability, 'The Availability');

      //trimming the values
      carType = validation.trimming(carType);
      currentLocation = validation.trimming(currentLocation);
      brand = validation.trimming(brand);
      model = validation.trimming(model);
      costPerHour = validation.trimming(costPerHour);
      availability = validation.trimming(availability);

      //validating carType
      let typeFlag = validation.checkSpecialCharWithNumber(carType);
      let carTypeFlag = validation.checkSpace(carType);
        if(carTypeFlag === true){
          throw `Error: Invalid Input for carType. It contains spaces`;
        }
      if(carType.length < 3)
        {
          throw `Error: carType must be at least 3 characters`;
        }
      if(typeFlag === true){
        throw `Error: Invalid Input for carType. It contains Special Charaters / Numbers`;
      }
      carType = carType.toLowerCase();
      //validating location
      let cityFlag = validation.checkSpecialCharWithNumber(currentLocation);
      if(cityFlag === true){
        throw `Error: Invalid Input for location. It contains Special Charater / Numbers`;
      }
      if(currentLocation.length < 2 || currentLocation.length > 20)
        {
          throw `Error: Invalid Input for location.`;
        }
        currentLocation = currentLocation.toLowerCase();

    //validating car brand
    let brandFlag = validation.checkNumber(brand);
    if(brandFlag === true){
        throw `Error: Invalid Input for brand. It contains Numbers`;
    }
    if(brand.length < 2 || brand.length > 20)
        {
          throw `Error: Invalid Input for brand.`;
        }

    //validating model
    if(model.length < 2 || model.length > 20)
        {
          throw `Error: Invalid Input for brand.`;
        }
    
    //validating cost per hour
    let count = 0;
for(let i = 0; i<costPerHour.length; i++){
    if (costPerHour[i] === "$"){
        count = count + 1;
    }
}
if (count > 1){
    throw `Error: Invalid Input for Cost per Hour.`
}
let slice = costPerHour.slice(1,costPerHour.length);
let conversion = parseFloat(slice);
if(conversion === NaN) throw `Error: cost is not a number`;

//validating availability
availability = availability.toLowerCase();
if(availability != "yes" && availability != "no"){
    throw `Error: Invalid Input for availability. Please enter valid value like [Yes or No]`;
  }
  
      let newCar = {
        carType: carType,
        currentLocation: currentLocation,
        brand: brand,
        model: model,
        costPerHour: costPerHour,
        rating: 0,
        availability: availability
      };
      const carCollection = await cars();
      const insertInfo = await carCollection.insertOne(newCar);
          if (!insertInfo.acknowledged || !insertInfo.insertedId){
            throw 'Could not add Car';
          }
  };
  const getCarById = async (carId) => {
    carId = carId.trim();
   validation.checkId(carId);
    const carCollection = await cars();
    const particularUser = await carCollection.findOne({_id: ObjectId(carId)});
    if (particularUser === null) throw 'Error: No Car with that id';
    //particularMovie._id = particularMovie._id.toString();
    return particularUser;
  
  };
  const getAllCars = async () => {
 
  
    const carCollection = await cars();
    const particularUser = await carCollection.find({}).toArray();
    if (!particularUser) throw "Could not get all cars";
  // moviesList._id = moviesList._id.toString();
  for (let i in particularUser) {
    particularUser[i]._id = particularUser[i]._id.toString();
  }
  return particularUser;
  
  };
  const getCarLocation = async (location) => {
    location = location.toLowerCase();
    location = location.trim();
   validation.checkString(location);
   if(location.length < 2 || location.length > 20)
        {
          throw `Error: Invalid Input for location.`;
        }
    location = location.toLowerCase();
    const carCollection = await cars();
    const particularUser = await carCollection.find({currentLocation: {$eq:location}});
    //console.log(particularUser);
    if (particularUser === null) throw 'Error: No Car with that location';
    //particularMovie._id = particularMovie._id.toString();
    return particularUser;
  
  };

  module.exports = {
    createCar,
    getCarById,
    getAllCars,
    getCarLocation
    
  };