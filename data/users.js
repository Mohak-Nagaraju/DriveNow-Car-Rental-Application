const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const {ObjectId} = require('mongodb');
const validation = require('../validation');
const bcrypt = require('bcryptjs');
const saltRounds = 16;
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
      //validating if they are all string
      validation.checkString(firstName, 'The firstName');
      validation.checkString(lastName, 'The lastName');
      validation.checkString(Email, 'The Email');
      validation.checkString(Gender, 'The Gender');
      validation.checkString(City, 'The City');
      validation.checkString(State, 'The State');
      validation.checkString(Age, 'The Age');
      validation.checkString(password, 'The password');
      validation.checkString(lincenceNumber, 'The lincenceNumber');

      //trimming the values
      firstName = validation.trimming(firstName);
      lastName = validation.trimming(lastName);
      Email = validation.trimming(Email);
      Gender = validation.trimming(Gender);
      City = validation.trimming(City);
      State = validation.trimming(State);
      Age = validation.trimming(Age);
      password = validation.trimming(password);
      lincenceNumber = validation.trimming(lincenceNumber);

      //validating first & last name
      let firstNameFlag = validation.checkSpecialCharWithNumber(firstName);
      if(firstName.length < 3)
        {
          throw `Error: firstName must be at least 3 characters`;
        }
      if(firstNameFlag === true){
        throw `Error: Invalid Input for firstName. It contains Special Charaters / Numbers`;
      }
      let lastNameFlag = validation.checkSpecialCharWithNumber(lastName);
      if(lastName.length < 3)
        {
          throw `Error: lastName must be at least 3 characters`;
        }
      if(lastNameFlag === true){
        throw `Error: Invalid Input for lastName. It contains Special Charater / Numbers`;
      }

      //validating gender
      Gender = Gender.toLowerCase();
      if(Gender != "woman" && Gender != "man" & Gender != 'transgender' & Gender !== "non-binary/non-conforming" & Gender !== "prefer not to respond"){
        throw `Error: Invalid Input for Gender. Please enter valid value like [woman, man, transgender, non-binary/non-conforming, prefer not to respond]`;
      }

      //validating Email
      let emailFlag = validation.validateEmail(Email);
      if(emailFlag === false){
        throw `Error: Invalid input for Email Address`;
      }

      //validating city
      let cityFlag = validation.checkSpecialCharWithNumber(City);
      if(cityFlag === true){
        throw `Error: Invalid Input for City. It contains Special Charater / Numbers`;
      }
      if(City.length < 2 || City.length > 20)
        {
          throw `Error: Invalid Input for City.`;
        }
        City = City.toLowerCase();

        //validating state
        let stateFlag = validation.checkSpecialCharWithNumber(State);
      if(stateFlag === true){
        throw `Error: Invalid Input for State. It contains Special Charater / Numbers`;
      }
      if(State.length <= 2 || State.length > 20)
        {
          throw `Error: Invalid Input for State. Please do not enter short forms like NJ / TX etc.`;
        }
        State = State.toLowerCase();

        //validating password
        let passFlag = validation.checkSpace(password);
        if(passFlag === true){
          throw `Error: Invalid Input for Password. It contains spaces`;
        }
        validation.passwordValidate(password);
        if(password.length < 6)
          {
            throw `Error: Password must be at least 6 characters`;
          }
        //validating lincenceNumber
        let licenseFlag = validation.checkSpace(lincenceNumber);
        if(licenseFlag === true){
          throw `Error: Invalid Input for lincenceNumber. It contains spaces`;
        }
      
        if(lincenceNumber.length !== 15)
          {
            throw `Error: Invalid Input for lincenceNumber. Please check again`;
          }

          //validating Age
          Age = parseFloat(Age); 
          if(Age === NaN) throw `Error: Age is not a number`;
          if(Age % 1 != 0) throw `Error: Age contains decimal point`;

      const passwordHash = await bcrypt.hash(password, saltRounds);
      const licenceHash = await bcrypt.hash(lincenceNumber, saltRounds);
      const userCollection = await users();
      const user = await usersCollection.findOne({ Email: Email });
      if (user) {
            throw `Error: Email is already present or in use.`;
      }
      let newUser = {
        firstName: firstName,
        lastName: lastName,
        Email: Email,
        Gender: Gender,
        City: City,
        State: State,
        Age: Age,
        password: passwordHash,
        lincenceNumber: licenceHash,
        cardDetails:[],
        walletAmount: 0
      };
      
    
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
   validation.checkId(userId);
    const userCollection = await users();
    const particularUser = await userCollection.findOne({_id: ObjectId(userId)});
    if (particularUser === null) throw 'Error: No user with that id';
    //particularMovie._id = particularMovie._id.toString();
    return particularUser;
  
  };
  const deleteUser = async (userId) => {
  
    userId = userId.trim();
    validation.checkId(userId);
  const userCollection = await users();
  const particularUser = await userCollection.findOne({_id: ObjectId(userId)});
  if (particularUser === null) throw 'Error: No user with that id';
  const deletionInfo = await userCollection.deleteOne({_id: ObjectId(userId)});

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete user with id of ${id}`;  }

  return `${particularUser.firstName} ${particularUser.lastName} has been successfully deleted!`;
};
const updateUser = async (
    userId,
    firstName,
    lastName,

    Gender,
    City,
    State,
    Age
    
  ) => {
    userId = userId.trim();
    validation.checkId(userId);
    if (!firstName || !lastName || !Email || !Gender || !City || !State || !Age || !password || !lincenceNumber){
        throw 'All fields need to have valid values';
      }
      validation.checkString(firstName, 'The firstName');
      validation.checkString(lastName, 'The lastName');
      validation.checkString(Email, 'The Email');
      validation.checkString(Gender, 'The Gender');
      validation.checkString(City, 'The City');
      validation.checkString(State, 'The State');
      validation.checkString(Age, 'The Age');
      validation.checkString(password, 'The password');
      validation.checkString(lincenceNumber, 'The lincenceNumber');

      //trimming the values
      firstName = validation.trimming(firstName);
      lastName = validation.trimming(lastName);
      Email = validation.trimming(Email);
      Gender = validation.trimming(Gender);
      City = validation.trimming(City);
      State = validation.trimming(State);
      Age = validation.trimming(Age);
      password = validation.trimming(password);
      lincenceNumber = validation.trimming(lincenceNumber);

      //validating first & last name
      let firstNameFlag = validation.checkSpecialCharWithNumber(firstName);
      if(firstName.length < 3)
        {
          throw `Error: firstName must be at least 3 characters`;
        }
      if(firstNameFlag === true){
        throw `Error: Invalid Input for firstName. It contains Special Charaters / Numbers`;
      }
      let lastNameFlag = validation.checkSpecialCharWithNumber(lastName);
      if(lastName.length < 3)
        {
          throw `Error: lastName must be at least 3 characters`;
        }
      if(lastNameFlag === true){
        throw `Error: Invalid Input for lastName. It contains Special Charater / Numbers`;
      }

      //validating gender
      Gender = Gender.toLowerCase();
      if(Gender != "woman" && Gender != "man" & Gender != 'transgender' & Gender !== "non-binary/non-conforming" & Gender !== "prefer not to respond"){
        throw `Error: Invalid Input for Gender. Please enter valid value like [woman, man, transgender, non-binary/non-conforming, prefer not to respond]`;
      }

      //validating city
      let cityFlag = validation.checkSpecialCharWithNumber(City);
      if(cityFlag === true){
        throw `Error: Invalid Input for City. It contains Special Charater / Numbers`;
      }
      if(City.length < 2 || City.length > 20)
        {
          throw `Error: Invalid Input for City.`;
        }
       // City = City.toLowerCase();

        //validating state
        let stateFlag = validation.checkSpecialCharWithNumber(State);
      if(stateFlag === true){
        throw `Error: Invalid Input for State. It contains Special Charater / Numbers`;
      }
      if(State.length <= 2 || State.length > 20)
        {
          throw `Error: Invalid Input for State. Please do not enter short forms like NJ / TX etc.`;
        }
       // State = State.toLowerCase();
        Age = parseFloat(Age); 
          if(Age === NaN) throw `Error: Age is not a number`;
          if(Age % 1 != 0) throw `Error: Age contains decimal point`;
        

      const updatedUser = {
        firstName: firstName,
        lastName: lastName,
        Gender: Gender,
        City: City,
        State: State,
        Age: Age,   
      };
     
      const particularUser = await getUserById(userId);
      if (particularUser === null) throw 'Error: No User with that id';
      if(firstName.toLowerCase() === particularUser.firstName.toLowerCase()){
        throw `Error: newFirstName same as the value stored in the Database`;
      }
      if(lastName.toLowerCase() === particularUser.lastName.toLowerCase()){
        throw `Error: newLastName same as the value stored in the Database`;
      }
      if(Gender.toLowerCase() === particularUser.Gender.toLowerCase()){
        throw `Error: newGender same as the value stored in the Database`;
      }
      if(City.toLowerCase() === particularUser.City.toLowerCase()){
        throw `Error: newCity same as the value stored in the Database`;
      }
      if(State.toLowerCase() === particularUser.State.toLowerCase()){
        throw `Error: newState same as the value stored in the Database`;
      }
      if(Age.toLowerCase() === particularUser.Age.toLowerCase()){
        throw `Error: newAge same as the value stored in the Database`;
      }
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
      const checkUser = async (Email, password) => {

        if (!Email || !password){
          throw 'All fields need to have valid values/supplied';
        }
        validation.checkString(Email, "The Email");
        validation.checkString(password, "The Password");
        Email = validation.trimming(Email);
        password = validation.trimming(password);
        let userflag = validation.checkSpace(Email);
        if(userflag === true){
          throw `Error: Invalid Input for Email. It contains spaces`;
      }
      let emailFlag = validation.validateEmail(Email);
      if(emailFlag === false){
        throw `Error: Invalid input for Email Address`;
      }
      let passFlag = validation.checkSpace(password);
        if(passFlag === true){
          throw `Error: Invalid Input for Password. It contains spaces`;
        }
        validation.passwordValidate(password);
        if(password.length < 6)
          {
            throw `Error: Password must be at least 6 characters`;
          }
      const usersCollection = await users();
      const user = await usersCollection.findOne({ Email: Email });
      if (!user) { 
        throw `Error: Either the Email or password is invalid`;
      }
      let comparePassword = false;
      comparePassword = await bcrypt.compare(password, user.password);
        if (comparePassword) {
          return {authenticatedUser: true};
        } else {
          throw `Error: Either the Email or password is invalid`;
        }
      
      };
      
    module.exports = {
      createUser,
      getAllUsers,
      getUserById,
      deleteUser,
      updateUser,
      checkUser
    };
    