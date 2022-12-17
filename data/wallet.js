const mongoCollections = require('../config/mongoCollections');
const wallet = mongoCollections.wallet;
//const users = mongoCollections.users;
const validation = require('../validation');
const {ObjectId} = require('mongodb');
const users = require('./users');
const bcrypt = require('bcryptjs');
const saltRounds = 16;


const createWallet = async (userId, amount, cardNumber, cvv, name, expiryMonth, expiryYear) =>{
    if (!userId) {
        throw "Please enter userId";
    }
    if (!amount) {
        throw "Please enter amount";
    }
        if (!cardNumber) {
            throw "Please enter credit card number";
        }
        if (!cvv){
            throw "please enter CVV";
        }
        if (!name){
            throw "Enter cardholder on the card";
        }
        if (!expiryMonth){
            throw "Enter expiry month for the credit card";
        }
        if (!expiryYear){
          throw "Enter expiry year for the credit card";
      }
      
        validation.checkString(amount,'walllet amount'),
         validation.checkString(cardNumber, 'The CardNumber');
         validation.checkString(cvv, 'The CVV Number');
         validation.checkString(name, 'The card holder name');
         validation.checkString(expiryMonth, 'Card expiryMonth');
         validation.checkString(expiryYear, 'Card expiryYear');

    name = name.toLowerCase();
    name = validation.trimming(name);
    let splitName = name.split(" ");
    console.log(splitName);
    if(splitName.length > 2){
      throw `Error: Enter FirstName LastName like abc bcd`;
  }
   
    let nameSpecChar = validation.checkSpecialCharWithNumber(name);
    let nameSpaceCheck = validation.checkSpace(splitName);
    if(nameSpaceCheck === true){
      throw `Error: Invalid Input for name. It contains spaces`;
      }
      if(nameSpecChar === true){
        throw `Error: Invalid Input for name. It contains Special Charater / Numbers`;
      }

      if(name.length < 3)
        {
          throw `Error: Name must be at least 3 characters`;
      }
      

    // validation of cvv
    let regex = new RegExp(/^[0-9]{3,4}$/);
    const cvvHash = await bcrypt.hash(cvv, saltRounds);
    cvv = validation.trimming(cvv);
    if (cvv.length < 3)
    {
        throw 'Error: cvv must be at least 3 digits';
    }
    if (regex.test(cvv) !== true)
    {
        throw 'Error: invalid cvv';
    }
    // validation of cardNumber
    const cardNumberHash = await bcrypt.hash(cardNumber, saltRounds);
    cardNumber = validation.trimming(cardNumber);
    if (cardNumber.length < 12)
    {
        throw 'Error: cardNumber must be atleast 12 digits';
    }
   

    // validation of expiryMonth
    expiryMonth = validation.trimming(expiryMonth);
    expiryMonth = parseFloat(expiryMonth); 
          if(expiryMonth === NaN) throw `Error: expiryMonth is not a number`;
          if(expiryMonth % 1 != 0) throw `Error: expiryMonth contains decimal point`;

    // validation of expiryYear
    expiryYear = validation.trimming(expiryYear);
    expiryYear = parseFloat(expiryYear); 
          if(expiryYear === NaN) throw `Error: expiryYear is not a number`;
          if(expiryYear % 1 != 0) throw `Error: expiryYear contains decimal point`;
          
const userData = await users.getUserById(userId);
const walletCollection = await wallet();
let walletAmount = {
    amount: amount,
    cardNumber: cardNumberHash,
    cvv: cvvHash,
    name: name,
    expiryMonth: expiryMonth,
    expiryYear: expiryYear,
}

      const insertInfo = await walletCollection.insertOne(walletAmount);
          if (!insertInfo.acknowledged || !insertInfo.insertedId){
            throw 'Could not add walletamount';
          }
          userData.wallet.push(walletAmount.amount);

          const updatedInfo = await walletCollection.updateOne(
            {_id: ObjectId(userId)},
            {
              $push: { wallet: walletAmount },
          }
          );
          if (updatedInfo.modifiedCount === 0) {
            throw 'could not add wallet successfully';
          }
          return await users.getUserById(userId);
  };
  module.exports = {
    createWallet
  };