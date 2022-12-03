const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const {ObjectId} = require('mongodb');
const validation = require('../validation');
const createUser = async (
    firstName,
    lastName,
    Email,
    Gender,
    City,
    State,
    Age,
    password,
    lincenceNumber
  ) => {
    if (!firstName || !lastName || !Email || !Gender || !City || !State || !Age || !password || !lincenceNumber){
        throw 'All fields need to have valid values';
      }
      let newUser = {
        firstName: firstName,
        lastName: lastName,
        Email: Email,
        Gender: Gender,
        City: City,
        State: State,
        Age: Age,
        password: password,
        lincenceNumber: lincenceNumber,
        cardDetails:[],
        walletAmount: 0
      };
      const userCollection = await users();
      const insertInfo = await userCollection.insertOne(newUser);
          if (!insertInfo.acknowledged || !insertInfo.insertedId){
            throw 'Could not add User';
          }
          //const newId = insertInfo.insertedId.toString();
          //const addedMovie = await getMovieById(newId);
          //return addedMovie;
  };  
  const getUserById = async (userId) => {
    userId = userId.trim();
   //validation.checkId(movieId);
    const userCollection = await users();
    const particularUser = await userCollection.findOne({_id: ObjectId(userId)});
    if (particularUser === null) throw 'Error: No user with that id';
    //particularMovie._id = particularMovie._id.toString();
    return particularUser;
  
  };
  const removeUser = async (userId) => {
  
    userId = userId.trim();
    //validation.checkId(movieId);

  const userCollection = await users();
  const particularUser = await userCollection.findOne({_id: ObjectId(userId)});
  if (particularUser === null) throw 'Error: No user with that id';
  const deletionInfo = await userCollection.deleteOne({_id: ObjectId(userId)});

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete user with id of ${id}`;
  }

  return `${particularUser.title} has been successfully deleted!`;
};
const updateUser = async (
    userId,
    firstName,
    lastName,
    Email,
    Gender,
    City,
    State,
    Age,
    password,
    lincenceNumber
  ) => {
    userId = userId.trim();
    validation.checkId(userId);
    if (!firstName || !lastName || !Email || !Gender || !City || !State || !Age || !password || !lincenceNumber){
        throw 'All fields need to have valid values';
      }
      const updatedUser = {
        firstName: firstName,
        lastName: lastName,
        Gender: Gender,
        City: City,
        State: State,
        Age: Age,
       
    
      };
      const userCollection = await users();
      const updatedInfo = await userCollection.updateOne(
        {_id: ObjectId(movieId)},
        {$set: updatedUser}
      );
      if (updatedInfo.modifiedCount === 0) {
        throw 'could not update user successfully';
      }
    
    };
    const getAllUsers = async () => {
        const userCollection = await movies();
          const userList = await userCollection.find({}).toArray();
          if (!userList) throw 'Could not get all users';
         // moviesList._id = moviesList._id.toString();
         for(let i in userList){
            userList[i]._id = userList[i]._id.toString();
         }
          return userList;
      };
    
    
    module.exports = {
      createUser,
      getAllUsers,
      getUserById,
      removeUser,
      updateUser
    };
    