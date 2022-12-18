const mongoCollections = require('../config/mongoCollections');
const bookings = mongoCollections.booking;
const {ObjectId} = require('mongodb');
const validation = require('../validation');
//const bookh = require('bookings.')
//const currentD = $.current-date;
//daysTag = require(".days");

const createBooking = async (amountPaid, pickUpDate, pickUpTime, returnTime, returnDate, location) => {
  

    if (!amountPaid) {
        throw "Please enter credit card number";
    }
    if (!pickUpDate){
        throw "please enter CVV";
    }
    if (!pickUpTime){
        throw "Enter cardholder on the card";
    }
    if (!returnTime){
        throw "Enter return time";
    }
    if (!returnDate){
      throw "Enter return date";
  }
  if (!location){
    throw "Enter location";
}

  
     validation.checkString(amountPaid, 'The amountPaid');
     validation.checkString(pickUpDate, 'The pickUpDate');
     validation.checkString(pickUpTime, 'The pickUpTime');
     validation.checkString(returnTime, 'returnTime');
     validation.checkString(returnDate, 'returnDate');
     validation.checkString(location, 'location');

     //validating pickupDate:

//calenderDateSelected();
let date = new Date();
let cDay = date.getDate();
let cMonth = date.getMonth() + 1;
let cYear = date.getFullYear();
pickUpDate = cYear + "-" + cMonth + "-" + cDay

//validating pickupTime
pickUpTime = date.getUTCHours() + ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds() + date.getTimezoneOffset();

//validating pickupTime
returnTime = date.getUTCHours() + ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds() + date.getTimezoneOffset();

//validating returnDate
let returnD = new Date();
let rDay = returnD.getDate();
let rMonth = returnD.getMonth() + 1;
let rYear = returnD.getFullYear();
returnD = rYear + "/" + rMonth + "/" + rDay


     const bookingCollection = await bookings();
     const booking = await bookingCollection.findOne({ amountPaid: amountPaid });
      if (booking) {
            throw `Error: Email is already present or in use.`;
      }
      
let newBooking = {
    
    amountPaid: amountPaid,
    pickUpDate: pickUpDate,
    pickUpTime: pickUpTime,
    returnTime: returnTime,
    returnDate: returnDate,
    location: location,
  
    };
  
    const insertInfo = await bookingCollection.insertOne(newBooking);
          if (!insertInfo.acknowledged || !insertInfo.insertedId){
            throw 'Could not add booking details';
          }
    
}
const getBookingById = async (bookingId) => {
    bookingId = bookingId.trim();
   validation.checkId(bookingId);
    const bookingCollection = await bookings();
    const particularBooking = await bookingCollection.findOne({_id: ObjectId(bookingId)});
    if (particularBooking === null) throw 'Error: No bookings with that id';
    return particularBooking;
  
  };

  const deleteBookingDetails = async (bookingId) => {
  
  bookingId = bookingId.trim();
  validation.checkId(bookingId);
  const bookingCollection = await bookings();
  const particularBooking = await bookingCollection.findOne({_id: ObjectId(bookingId)});
  if (particularBooking === null) throw 'Error: No bookings with that id';
  const deletionInfo = await bookingCollection.deleteOne({_id: ObjectId(bookingId)});

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete booking details with id of ${id}`;  }

  return `${particularBooking.bookingId} has been successfully deleted!`;
};

const updateBooking = async (amountPaid, pickUpDate, pickUpTime, returnTime, returnDate, location) => {
    if (!amountPaid) {
        throw "Please enter credit card number";
    }
    if (!pickUpDate){
        throw "please enter CVV";
    }
    if (!pickUpTime){
        throw "Enter cardholder on the card";
    }
    if (!returnTime){
        throw "Enter expiry month for the credit card";
    }
    if (!returnDate){
      throw "Enter expiry year for the credit card";
  }
  if (!location){
    throw "Enter location";
}
  
     validation.checkString(amountPaid, 'The amountPaid');
     validation.checkString(pickUpDate, 'The pickUpDate');
     validation.checkString(pickUpTime, 'The pickUpTime');
     validation.checkString(returnTime, 'returnTime');
     validation.checkString(returnDate, 'returnDate');
     validation.checkString(location, 'location');


     //validating amountpaid


     let updateBooking = {
    
        amountPaid: amountPaid,
        pickUpDate: pickUpDate,
        pickUpTime: pickUpTime,
        returnTime: returnTime,
        returnDate: returnDate,
        location: location
        };
        const bookingCollection = await bookings();
        const updatedInfo = await bookingCollection.updateOne(
          {_id: ObjectId(bookingId)},
          {$set: updateBooking}
        );
        if (updatedInfo.modifiedCount === 0) {
          throw 'could not update bookings successfully';
        }
}
    const getAllBookings = async () => {
    const bookingCollection = await bookings();
      const bookingList = await bookingCollection.find({}).toArray();
      if (!bookingList) throw 'Could not get all bookings';
     for(let i in bookingList){
        bookingList[i]._id = bookingList[i]._id.toString();
     }
      return bookingList;
  };

  module.exports = {
    createBooking,
    getBookingById,
    deleteBookingDetails,
    updateBooking,
    getAllBookings,
  };