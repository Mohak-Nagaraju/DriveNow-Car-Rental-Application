
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const {ObjectId} = require('mongodb');
const userData = require('./users');
const validation = require('../validation');
const bcrypt = require("bcryptjs");
const saltRounds = 16;

const createCardInfo = async (
  userId, 
  cardNumber, 
  cvv, 
  cardHolderName, 
  expiryMonth, 
  expiryYear
  ) => {
  
  if (!userId) {
    throw "Please enter credit card number";
}
    if (!cardNumber) {
        throw "Please enter credit card number";
    }
    if (!cvv){
        throw "please enter CVV";
    }
    if (!cardHolderName){
        throw "Enter cardholder on the card";
    }
    if (!expiryMonth){
        throw "Enter expiry month for the credit card";
    }
    if (!expiryYear){
      throw "Enter expiry year for the credit card";
  }
  
  //validation checkstring
  validation.checkString(cardNumber, "The cardNumber");
  validation.checkString(cvv, "cvv number");
  validation.checkString(cardHolderName, "The name on card");
  validation.checkString(expiryMonth, "expiry month of the card");
  validation.checkString(expiryYear, "expiry year of the card");
    

     //userId = valid.trimming(userId);
    // validation of name
    cardHolderName = cardHolderName.toLowerCase();
    cardHolderName = validation.trimming(cardHolderName);
    let splitName = cardHolderName.split(" ");
    console.log(splitName);
    if(splitName.length > 2){
      throw `Error: Enter FirstName LastName like abc bcd`;
  }
   
    let nameSpecChar = validation.checkSpecialCharWithNumber(cardHolderName);
    let nameSpaceCheck = validation.checkSpace(splitName);
    if(nameSpaceCheck === true){
      throw `Error: Invalid Input for name. It contains spaces`;
      }
      if(nameSpecChar === true){
        throw `Error: Invalid Input for name. It contains Special Charater / Numbers`;
      }

      if(cardHolderName.length < 3)
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

      
          const useData = await userData.getUserById(userId);
    
          const userCollection = await users();
     
    
      let newCard = {
        _id: ObjectId().toString(),
        cardNumber: cardNumberHash,
        cvv: cvvHash,
        cardHolderName: cardHolderName,
        expiryMonth: expiryMonth,
        expiryYear: expiryYear,
        
        }
      
        useData.cardDetails.push(newCard);

        const updatedInfo = await userCollection.updateOne(
          {_id: ObjectId(userId)},
          {
            $push: { cardDetails: newCard },
        }
        );
        if (updatedInfo.modifiedCount === 0) {
          throw 'could not add card successfully';
        }
      
        return await userData.getUserById(userId);
        
    };

    const getAllCards = async (userId) => {
      userId = validation.trimming(userId);
      validation.checkId(userId);
      const userDataa = await userData.getUserById(userId);
      if(userDataa.cardDetails.length === 0) throw `Error: No cards for the user with ID: ${userId}`;
      return userDataa.cardDetails;
    
    };

    const getCardById = async (cardId) => {
      cardId = validation.trimming(cardId);
      validation.checkId(cardId);
     
      
      const userCollection = await users();
     
      const particularCard = await userCollection.findOne({
        "cardDetails._id": cardId,
    },
    {
        projection: {
            _id: 0,
            "cardDetails.$": 1,
        },
    }
    );  
       if (particularCard === null) throw 'Error: No card with that id'; 
      
      
      particularCard.cardDetails[0]._id = particularCard.cardDetails[0]._id.toString();
     
    
      return particularCard.cardDetails[0];
     
    };

    const deleteCard = async (cardId) => {
      cardId = validation.trimming(cardId);
      validation.checkId(cardId);
      const userCollection = await users();
      let allCards = await userData.getAllUsers();
      for(let i in allCards){
        for(let j in allCards[i].cardDetails){
          if(allCards[i].cardDetails[j]._id === cardId){
            var uId = allCards[i]._id;
          }
        }
        
      }
      const foundCard = await userCollection.findOne({
          "cardDetails._id": cardId
      });
    
      if (!foundCard) {
          throw `Error: No card with that id.`;
      }
    
    
      const updatedInfo = await userCollection.updateOne(
          { _id: foundCard._id },
          {
              $pull: { cardDetails: { _id: cardId } },
          }
      );
    
      if (updatedInfo.modifiedCount === 0) {
        throw 'could not delete card successfully';
      }
    
      return await userData.getUserById(uId);
    };





module.exports = {
    createCardInfo,
    getAllCards,
    getCardById,
    deleteCard,
    
    
  };
