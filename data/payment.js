const mongoCollections = require('../config/mongoCollections');
const payment = mongoCollections.payment;
const {ObjectId} = require('mongodb');
const validation = require('../validation');
//const bookings = require('./booking');
//const data = require('../data');
const  cards = require('./cards');
const wallet = require('./wallet');
const users  = require('./users');
const createPayment = async (bookingID, userID, paymentType) => {
    if (!bookingID){
        throw "you must provide an booking ID";
    }
    if (!userID){
        throw "you must provide an User ID";
    }
    if (!paymentType){
        throw "you must provide an payment type";
    }
    if (!ObjectId.isValid(bookingID)) {
        throw 'invalid booking ID';
    }
    if (!ObjectId.isValid(userID)){ 
        throw 'invalid user ID';
    }
    validation.checkString(bookingID, 'bookingID');
    validation.checkString(userID, 'userID');
    validation.checkString(paymentType, 'paymentType');

    if (bookingID.trim().length == 0 || userID.trim().length == 0 || paymentType.trim().length == 0)
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
let cardPay;
    if (paymentType == cardPay){
        cards.createCardInfo();       
    }
    else {
        wallet.createWallet();
    }
    
    const paymentCollection = await payment();

    let paymentDetails = {
        bookingID: bookingID,
        userID: userID,
        paymentType: paymentType,
    }
    
      const insertInfo = await paymentCollection.insertOne(paymentDetails);
          if (!insertInfo.acknowledged || !insertInfo.insertedId){
            throw 'Could not add payment method';
          }
          
        };   



const getPaymentById = async (userId) => {
    userId = userId.trim();
    validation.checkId(userId);
    const userCollection = await users();
    const particularUser = await userCollection.findOne({
      _id: ObjectId(userId),
    });
    if (particularUser === null) throw "Error: No boookings with that id";
    //particularMovie._id = particularMovie._id.toString();
    return particularUser;
  };

 
module.exports = {
    createPayment,
    getPaymentById,
  };