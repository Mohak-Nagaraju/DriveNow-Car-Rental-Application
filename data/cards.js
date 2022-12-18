// const mongoCollections = require('../config/mongoCollections');
// const cards = mongoCollections.cards;

// const users = require('./users');
// const {ObjectId} = require('mongodb');
// const bcrypt = require('bcryptjs');
// const saltRounds = 16;
// const validation = require('../validation');
// const createCardInfo = async ( cardNumber, cvv, name, expiryMonth, expiryYear) => {
  

// //const users = mongoCollections.users;
// const {ObjectId} = require('mongodb');
// const users = require('./users');
// const bcrypt = require('bcryptjs');
// const saltRounds = 16;
// const validation = require('../validation');
// //const { users } = require('.');

// const createCardInfo = async (userId, cardNumber, cvv, name, expiryMonth, expiryYear) => {
  
//   if (!userId) {
//     throw "Please enter credit card number";
// }

//     if (!cardNumber) {
//         throw "Please enter credit card number";
//     }
//     if (!cvv){
//         throw "please enter CVV";
//     }
//     if (!name){
//         throw "Enter cardholder on the card";
//     }
//     if (!expiryMonth){
//         throw "Enter expiry month for the credit card";
//     }
//     if (!expiryYear){
//       throw "Enter expiry year for the credit card";
//   }
//   console.log(userId.toString()
// );
//     userId = validation.trimming(userId.toString());

//      validation.checkString(cardNumber, 'The CardNumber');
//      validation.checkString(cvv, 'The CVV Number');
//      validation.checkString(name, 'The card holder name');
//      validation.checkString(expiryMonth, 'Card expiryMonth');
//      validation.checkString(expiryYear, 'Card expiryYear');
     

//      //userId = valid.trimming(userId);
//     // validation of name
//     name = name.toLowerCase();
//     name = validation.trimming(name);
//     let splitName = name.split(" ");
//     console.log(splitName);
//     if(splitName.length > 2){
//       throw `Error: Enter FirstName LastName like abc bcd`;
//   }
   
//     let nameSpecChar = validation.checkSpecialCharWithNumber(name);
//     let nameSpaceCheck = validation.checkSpace(splitName);
//     if(nameSpaceCheck === true){
//       throw `Error: Invalid Input for name. It contains spaces`;
//       }
//       if(nameSpecChar === true){
//         throw `Error: Invalid Input for name. It contains Special Charater / Numbers`;
//       }

//       if(name.length < 3)
//         {
//           throw `Error: Name must be at least 3 characters`;
//       }
      

//     // validation of cvv
//     let regex = new RegExp(/^[0-9]{3,4}$/);
//     const cvvHash = await bcrypt.hash(cvv, saltRounds);
//     cvv = validation.trimming(cvv);
//     if (cvv.length < 3)
//     {
//         throw 'Error: cvv must be at least 3 digits';
//     }
//     if (regex.test(cvv) !== true)
//     {
//         throw 'Error: invalid cvv';
//     }
//     // validation of cardNumber
//     const cardNumberHash = await bcrypt.hash(cardNumber, saltRounds);
//     cardNumber = validation.trimming(cardNumber);
//     //let regex1 = new RegExp(/^[0-9]$/);
//     if (cardNumber.length < 12)
//     {
//         throw 'Error: cardNumber must be atleast 12 digits';
//     }
//    // if (regex.test(cardNumber) !== true)
//     //{
//       //  throw 'Error: invalid cardNumber';
//     //}

//     // validation of expiryMonth
//     expiryMonth = validation.trimming(expiryMonth);
//     expiryMonth = parseFloat(expiryMonth); 
//           if(expiryMonth === NaN) throw `Error: expiryMonth is not a number`;
//           if(expiryMonth % 1 != 0) throw `Error: expiryMonth contains decimal point`;

//     // validation of expiryYear
//     expiryYear = validation.trimming(expiryYear);
//     expiryYear = parseFloat(expiryYear); 
//           if(expiryYear === NaN) throw `Error: expiryYear is not a number`;
//           if(expiryYear % 1 != 0) throw `Error: expiryYear contains decimal point`;


//       //if (card) {
//         //    throw `Error: card is already present or in use.`;
//       //}
//       const cardsCollection = await cards();

//       //const cardOfUser = await users.getUserById(cardId);
//       //const userCollection = await movies();
     
    
//       let newCard = {
      
//       //const userData = await users.getUserById(userId);
//       //const userCollection = await users();


//      const cardCollection = await cards();
//      const userWhoHasThisCard = await users.getUserById(userId)
     
    
//       let newCard = {
//         user: {
//           id: ObjectId(userId),
//           cardDetails: userWhoHasThisCard.cardDetails
//         },

//         cardNumber: cardNumberHash,
//         cvv: cvvHash,
//         name: name,
//         expiryMonth: expiryMonth,
//         expiryYear: expiryYear,

//         //card: {
//           //id: ObjectId(cardId),
//           //name: cardOfUser.name
//         }
      
//       //const cardCollection = await cards();

//       const insertInfo = await cardsCollection.insertOne(newCard);
//      //cardsData.cardDetails.push(cardDetails);
//       /*const updatedInfo = await cardsCollection.updateOne(
//         {_id: ObjectId(cardId)},
//         {
//           $push: { cardDetails: newCard  },
//          $set: { cardDetails: newCard }, 
//         }
//       ); */
    
//       //users.cardDetails = await cardCollection.insertOne(cardDetails);
//       //users.cardDetails.push(cardDetails);
//           if (!insertInfo.acknowledged || !insertInfo.insertedId){
//             throw 'Could not add card';
//           }
//           //if (updatedInfo.modifiedCount === 0) {
//            // throw 'could not add Review successfully';
//           //}
//           //return await this.getcardById(newId.toString()); ------------
//           //const newId = insertInfo.insertedId;
//           //const newCardInfo = await this.getCardById(insertInfo.insertedId.toString());
//           //return await this.getCardById(newId.toString());
//         };


// const getCardById = async (cardId) => {
//   cardId = cardId.trim();
//  validation.checkId(cardId);
//   const cardsCollection = await cards();
//   const specificCard = await cardsCollection.findOne({_id: ObjectId(cardId)});

        
//         }
      
    
//         const newInsertInformation = await cardCollection.insertOne(newCard);
//         const newId = newInsertInformation.insertedId;
//         return await users.getUserById(newId.toString());
//       };
//           /*const updatedInfo = await userCollection.updateOne(
//             {_id: ObjectId(userId)},
//             {
//               $push: { cardDetails: newCard },
//           }
//           );
//           console.log(updatedInfo);
          
//           if (updatedInfo.modifiedCount === 0) {
//             throw 'could not add card successfully';
//           }
//           return await users.getUserById(userId);
          
//         };*/


// const getCardById = async (cardId) => {
//  cardId = cardId.trim();
//  validation.checkId(cardId);
//   const cardCollection = await cards();
//   const specificCard = await cardCollection.findOne({_id: ObjectId(cardId)});

//   if (specificCard === null) throw 'Error: No card with that id';
//   return specificCard;

// };
// const deleteCard = async (cardId) => {
  
//   cardId = cardId.trim();
//   validation.checkId(cardId);
// const cardsCollection = await cards();
// const specificCard = await cardsCollection.findOne({_id: ObjectId(cardId)});
// if (specificCard === null) throw 'Error: No card with that id';
// const deletionInfo = await cardsCollection.deleteOne({_id: ObjectId(cardId)});

// if (deletionInfo.deletedCount === 0) {
//   throw `Could not delete card with id of ${id}`;  }

// return `${particularUser.cardNumber} has been successfully deleted!`;
// };


// const updateCardInfo = async (userId, cardNumber, cvv, name, expiryMonth, expiryYear) => {

//   cardId = cardId.trim();
//     validation.checkId(cardId);
//   if (!cardNumber) {   
//     throw "Please enter credit card number";
// }
// if (!cvv){
//     throw "please enter CVV";
// }
// if (!name){
//     throw "Enter card Holder on the card";
// }
// if (!expiryMonth){
//     throw "Enter expiry month for the credit card";
// }
// if (!expiryYear){
//   throw "Enter expiry year for the credit card";
// }

//  validation.checkString(cardNumber, 'The CardNumber');
//  validation.checkString(cvv, 'The CVV Number');
//  validation.checkString(name, 'The card holder name');
//  validation.checkString(expiryMonth, 'Card expiryMonth');
//  validation.checkString(expiryYear, 'Card expityYear')

//  if (cardNumber.trim().length == 0 || cvv.trim().length == 0 || name.trim().length == 0)
//     {
//         throw "Incorrect input";
//     }
//     // validation of name
//     name = name.toLowerCase();
//     name = validation.trimming(name);
//     let nameSpecChar = validation.checkSpecialCharWithNumber(firstName);
//     //let fNameSpaceCheck = validation.checkSpace(firstName);
//     //if(fNameSpaceCheck === true){
//       //  throw `Error: Invalid Input for name. It contains spaces`;
//       //}
//       if(nameSpecChar === true){
//         throw `Error: Invalid Input for name. It contains Special Charater / Numbers`;
//       }
//       if(name.length < 3)
//         {
//           throw `Error: Name must be at least 3 characters`;
//         }

//     // validation of cvv
//     let regex = new RegExp(/^[0-9]{3,4}$/);
//     if (cvv.length < 3)
//     {
//         throw 'Error: cvv must be at least 3 digits';
//     }
//     if (regex.test(cvv) !== true)
//     {
//         throw 'Error: invalid cvv';
//     }
//     // validation of cardNumber
//     //let regex1 = new RegExp(/^[0-9]$/);
//     if (cardNumber.length < 12)
//     {
//         throw 'Error: cardNumber must be atleast 12 digits';
//     }
//    // if (regex.test(cardNumber) !== true)
//     //{
//       //  throw 'Error: invalid cardNumber';
//     //}
//     // validation of expiryMonth
//     expiryMonth = validation.trimming(expiryMonth);
//     expiryMonth = parseFloat(expiryMonth); 
//           if(expiryMonth === NaN) throw `Error: expiryMonth is not a number`;
//           if(expiryMonth % 1 != 0) throw `Error: expiryMonth contains decimal point`;

//     //validation of expiryYear
//     expiryYear = validation.trimming(expiryYear);
//     expiryYear = parseFloat(expiryYear); 
//           if(expiryYear === NaN) throw `Error: expiryYear is not a number`;
//           if(expiryYear % 1 != 0) throw `Error: expiryYear contains decimal point`;

    
//     //const card = await cardCollection.findOne({ cardNumber: cardNumber });
//       //if (card) {
//         //    throw `Error: card is already present or in use.`;
//       //}
//       const updatedCardInfo = {
//         cardNumber: cardNumber,
//         cvv: cvv,
//         name: name,
//         expiryMonth: expiryMonth,
//         expiryYear: expiryYear,   
//       };
//       const specificCard = await getcardById(cardId);
//       if (specificCard === null) throw 'Error: No card with that id';
//       if(name.toLowerCase() === specificCard.name.toLowerCase()){
//         throw `Error: newFirstName same as the value stored in the Database`;
//       }
//       if(cardNumber === specificCard.cardNumber){
//         throw `Error: newCardNumber same as the value stored in the Database`;
//       }
//       if(cvv === specificCard.cvv){
//         throw `Error: newCVV same as the value stored in the Database`;
//       }
      
//       const cardsCollection = await cards();
//       const updatedCard = await cardsCollection.updateOne(
//         {_id: ObjectId(cardId)},
//         {$set: updatedCardInfo}
//       );
//       if (updatedCard.modifiedCount === 0) {
//         throw 'could not update card successfully';
//       }
// }
// const getAllCards = async () => {
//   const cardsCollection = await cards();
//     const cardList = await cardsCollection.find({}).toArray();
//     if (!cardList) throw 'Could not get all cards';
//    // moviesList._id = moviesList._id.toString();
//    for(let i in cardList){
//       cardList[i]._id = cardList[i]._id.toString();
//    }
//     return cardList;
// };

// module.exports = {
//     createCardInfo,
//     getCardById,
//     deleteCard,
//     updateCardInfo,
//     getAllCards,
//   };
