const mongoCollections = require('../config/mongoCollections');
const payment = mongoCollections.payment;
const {ObjectId} = require('mongodb');
const validation = require('../validation');
const uBookingData = require('./booking');


const createPayment = async (bookingId, userId, paymentType) => {
    if (!bookingId){
        throw "you must provide an booking ID";
    }
    if (!userId){
        throw "you must provide an User ID";
    }
    if (!paymentType){
        throw "you must provide an payment type";
    }
    if (!ObjectId.isValid(bookingId)) {
        throw 'invalid booking ID';
    }
    if (!ObjectId.isValid(userId)){ 
        throw 'invalid user ID';
    }
    validation.checkString(bookingId, 'bookingId');
    validation.checkString(userId, 'userId');
    validation.checkString(paymentType, 'paymentType');

    if (bookingId.trim().length == 0 || userId.trim().length == 0 || paymentType.trim().length == 0)
    {
        throw "Incorrect input";
    }


    //bookingID paymentType
    let typeFlag = validation.checkSpecialCharWithNumber(paymentType);
    let paymentTypeFlag = validation.checkSpace(paymentType);
      if(paymentTypeFlag === true){
        throw `Error: Invalid Input for paymentType. It contains spaces`;
      }
    if(paymentType.length < 3)
      {
        throw `Error: paymentType must be at least 3 characters`;
      }
    if(typeFlag === true){
      throw `Error: Invalid Input for paymentType. It contains Special Charaters / Numbers`;
    }
    paymentType = paymentType.toLowerCase();
    if (
      paymentType != "wallet" &&
      paymentType != "card" 
    ) {
      throw `Error: Please select valid input for paymentType (wallet, card)`;
    }

    

//const userBookData = await uBookingData.getBookingById(bookingId);
    const paymentCollection = await payment();

    let paymentDetails = {
      _id: ObjectId().toString(),
      bookingId: bookingId,
      userId: userId,
      paymentType: paymentType,
    }
    
      const insertInfo = await paymentCollection.insertOne(paymentDetails);
          if (!insertInfo.acknowledged || !insertInfo.insertedId){
            throw 'Could not add payment method';
          }
          
        };   



const getPaymentById = async (bookingId) => {
    bookingId = bookingId.trim();
    validation.checkId(bookingId);
    const bookingDataa = await uBookingData.getBookingById(bookingId);
   if(bookingDataa.length === 0) throw `Error: No payment for the booking with ID: ${bookingId}`;
   return bookingDataa.amountPaid;
  };

 
module.exports = {
    createPayment,
    getPaymentById
  };