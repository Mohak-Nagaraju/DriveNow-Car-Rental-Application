const mongoCollections = require('../config/mongoCollections');
const payments = mongoCollections.payment;
const {ObjectId} = require('mongodb');
const validation = require('../validation');
const bookings = require('./booking')
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
   //if (paymentType = card){
     
   //s}
    const paymentCollection = await payments();
    /* const bookingCollection = await bookings();
    const payment = await bookingCollection.findOne({ bookingID: bookingID });
      if (payment) {
            throw `Error: Payment is already done.`;
      } */

    let paymentDetails = {
        bookingID: bookingID,
        userID: userID,
        paymentType: paymentType,
    }
    
      const insertInfo = await paymentCollection.insertOne(paymentDetails);
          if (!insertInfo.acknowledged || !insertInfo.insertedId){
            throw 'Could not add payment method';
          }

          /*const getPaymentById = async (paymentId) => {
            paymentId = paymentId.trim();
           validation.checkId(paymentId);
            const paymentCollection = await payment();
            const specificPayment = await paymentCollection.findOne({_id: ObjectId(paymentId)});
            if (specificPayment === null) throw 'Error: No payment method with that id';
            return specificPayment;
          
          };*/
}

module.exports = {
    createPayment,
    //getPaymentById,
  };