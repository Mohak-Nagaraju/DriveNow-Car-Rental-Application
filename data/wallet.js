const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const {ObjectId} = require('mongodb');
const userWData = require('./users');
const validation = require('../validation');
//const bcrypt = require('bcryptjs');
//const saltRounds = 16;


const createWallet = async (userId, walletAmount) =>{
    if (!userId) {
        throw "Please enter userId";
    }
    if (!walletAmount) {
        throw "Please enter amount to add in wallet";
    }
      
        validation.checkString(walletAmount,'walllet amount');

    // validation of walletAmount
    walletAmount = parseInt(walletAmount);
    if (walletAmount === NaN) throw `Error: wallet Amount to be added is not a number`;
    
    if (walletAmount.length < 2)
    {
        throw 'Error: walletAmount must be atleast 2 digits';
    }
    if (walletAmount < 10){
      throw 'Error: walletAmount must be atleast $10'
    }
      
          
    const userData = await userWData.getUserById(userId);
    
    const userCollection = await users();

    let newWallet = {
      _id: ObjectId().toString(),
      walletAmount: walletAmount
    };
   
    userData.walletAmount.push(newWallet);
 
    
    const updatedInfo = await userCollection.updateOne(
      {_id: ObjectId(userId)},
      {
        $push: { walletAmount: newWallet },
    }
    );
    if (updatedInfo.modifiedCount === 0) {
      throw 'could not add wallet successfully';
    }
  
    return await userWData.getUserById(userId);
    
};
const getAllWallet = async (userId) => {
  userId = validation.trimming(userId);
  validation.checkId(userId);
  const userDataa = await userWData.getUserById(userId);
  if(userDataa.walletAmount.length === 0) throw `Error: No wallet Amount for the user with ID: ${userId}`;
  return userDataa.walletAmount;
};

const getWalletAmountById = async (walletId) => {
  walletId = validation.trimming(walletId);
  validation.checkId(walletId);
 
  
  const userCollection = await users();
 
  const particularWallet = await userCollection.findOne({
    "walletAmount._id": walletId,
},
{
    projection: {
        _id: 0,
        "walletAmount.$": 1,
    },
}
);  
   if (particularWallet === null) throw 'Error: No wallet with that id'; 
  
  
  particularWallet.walletAmount[0]._id = particularWallet.walletAmount[0]._id.toString();
 

  return particularWallet.walletAmount[0];
 
};

const removeWallet = async (walletId) => {
  walletId = validation.trimming(walletId);
  validation.checkId(walletId);
  const userCollection = await users();
  let allWallet = await userWData.getAllUsers();
  for(let i in allWallet){
    for(let j in allWallet[i].walletAmount){
      if(allWallet[i].walletAmount[j]._id === walletId){
        var uWalletId = allWallet[i]._id;
      }
    }
    
  }
  const foundWallet = await userCollection.findOne({
      "walletAmount._id": walletId
  });

  if (!foundWallet) {
      throw `Error: No wallet with that id.`;
  }


  const updatedInfo = await userCollection.updateOne(
      { _id: foundWallet._id },
      {
          $pull: { walletAmount: { _id: walletId } },
      }
  );

  if (updatedInfo.modifiedCount === 0) {
    throw 'could not delete wallet successfully';
  }

  return await userWData.getUserById(uWalletId);
};



  module.exports = {
    createWallet,
    getAllWallet,
    getWalletAmountById,
    removeWallet
  };