const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
const validation = require("../validation");
const bcrypt = require("bcryptjs");
const saltRounds = 16;

const createUser = async (
  firstName,
  lastName,
  email,
  gender,
  city,
  state,
  age,
  password,
  lincenceNumber
) => {
  if (
    !firstName ||
    !lastName ||
    !email ||
    !gender ||
    !city ||
    !state ||
    !age ||
    !password ||
    !lincenceNumber
  ) {
    throw "All fields must have valid input - not provideds";
  }
  //validating if they are all string
  validation.checkString(firstName, "The firstName");
  validation.checkString(lastName, "The lastName");
  validation.checkString(email, "The Email");
  validation.checkString(gender, "The Gender");
  validation.checkString(city, "The City");
  validation.checkString(state, "The State");
  validation.checkString(age, "The Age");
  validation.checkString(password, "The password");
  validation.checkString(lincenceNumber, "The lincenceNumber");

  //trimming the values
  firstName = validation.trimming(firstName);
  lastName = validation.trimming(lastName);
  email = validation.trimming(email);
  gender = validation.trimming(gender);
  city = validation.trimming(city);
  state = validation.trimming(state);
  age = validation.trimming(age);
  password = validation.trimming(password);
  lincenceNumber = validation.trimming(lincenceNumber);

  //validating first & last name
  let firstNameFlag = validation.checkSpecialCharWithNumber(firstName);
  let firstFlag = validation.checkSpace(firstName);
  if (firstFlag === true) {
    throw `Error: Invalid Input for firstName. It contains spaces`;
  }
  if (firstName.length < 3) {
    throw `Error: firstName must be at least 3 characters`;
  }
  if (firstNameFlag === true) {
    throw `Error: Invalid Input for firstName. It contains Special Charaters/Numbers`;
  }
  let lastNameFlag = validation.checkSpecialCharWithNumber(lastName);
  let lastFlag = validation.checkSpace(lastName);
  if (lastFlag === true) {
    throw `Error: Invalid Input for lastName. It contains spaces`;
  }
  if (lastName.length < 3) {
    throw `Error: lastName must be at least 3 characters`;
  }
  if (lastNameFlag === true) {
    throw `Error: Invalid Input for lastName. It contains Special Charater/Numbers`;
  }

  //validating gender
  //console.log("gender endterd is  in createUser...",gender);
  gender = gender.toLowerCase();
  if (
    gender != "female" &&
    gender != "male" &&
    gender != "transgender" &&
    gender != "genderneutral" &&
    gender !== "nonbinary" &&
    gender !== "other"
  ) {
    //console.log("gender was..",gender)
    throw `Error: Please select valid input for Gender (female, male, transgender, gender neutral, non-binary, other - from create user)`;
  }

  //validating email
  let emailFlag = validation.validateEmail(email);
  if (emailFlag === false) {
    throw `Error: Invalid input for email address`;
  }

  //validating city
  let cityFlag = validation.checkSpecialCharWithNumber(city);
  if (cityFlag === true) {
    throw `Error: Invalid Input for city. It contains Special Charater/Numbers`;
  }
  if (city.length < 2 || city.length > 20) {
    throw `Error: Invalid Input for city.`;
  }
  city = city.toLowerCase();

  //validating state
  let stateFlag = validation.checkSpecialCharWithNumber(state);
  if (stateFlag === true) {
    throw `Error: Invalid Input for state. It contains Special Charater/Numbers`;
  }
  if (state.length < 2 || state.length > 20) {
    throw `Error: Invalid Input for state. Please enter short forms like NJ / TX etc. or Complete Name`;
  }
  state = state.toLowerCase();

  //validating password
  let passFlag = validation.checkSpace(password);
  if (passFlag === true) {
    throw `Error: Invalid Input for Password. It contains spaces`;
  }
  validation.passwordValidate(password);
  if (password.length < 8) {
    throw `Error: Password must be at least 8 characters`;
  }
  //validating lincenceNumber
  let licenseFlag = validation.checkSpace(lincenceNumber);
  if (licenseFlag === true) {
    throw `Error: Invalid Input for lincenceNumber. It contains spaces`;
  }

  if (lincenceNumber.length !== 15) {
    throw `Error: Invalid Input for lincenceNumber. Please check again`;
  }

  //validating age
  age = parseFloat(age);
  if (age === NaN) throw `Error: age is not a number`;
  if (age % 1 != 0) throw `Error: age contains decimal point`;

  let dbEmail = email.toLowerCase();
  //email.toLowerCase();
  firstName = firstName.toLowerCase();
  lastName = lastName.toLowerCase();
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const licenceHash = await bcrypt.hash(lincenceNumber, saltRounds);
  const userCollection = await users();
  const user = await userCollection.findOne({ email: dbEmail });
  if (user) {
    throw `Error: Email ${email} is already registered with us. Please use a different email`;
  }
  let newUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    gender: gender,
    city: city,
    state: state,
    age: age,
    password: passwordHash,
    lincenceNumber: licenceHash,
    cardDetails: [],
    walletAmount: 0,
  };

  const insertInfo = await userCollection.insertOne(newUser);

  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw "Could not add User. Contact Admin";
  }

  return { insertedUser: true };

  /* const newId = insertInfo.insertedId.toString();
  const addedMovie = await getMovieById(newId);
  return addedMovie; */
};

//get the user by given ID
const getUserById = async (userId) => {
  userId = userId.trim();
  validation.checkId(userId);
  const userCollection = await users();
  const particularUser = await userCollection.findOne({
    _id: ObjectId(userId),
  });
  if (particularUser === null) throw "Error: No user with that id";
  //particularMovie._id = particularMovie._id.toString();
  return particularUser;
};

//delete the user with given ID form db
const deleteUser = async (userId) => {
  userId = userId.trim();
  validation.checkId(userId);
  const userCollection = await users();
  const particularUser = await userCollection.findOne({
    _id: ObjectId(userId),
  });
  if (particularUser === null) throw "Error: No user with that id";
  const deletionInfo = await userCollection.deleteOne({
    _id: ObjectId(userId),
  });

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete user with id of ${id}`;
  }

  return `${particularUser.firstName} ${particularUser.lastName} has been successfully deleted!`;
};

//update the user information except email, password, and lincenceNumber
const updateUser = async (
  userId,
  firstName,
  lastName,
  gender,
  city,
  state,
  age
) => {
  userId = userId.trim();
  validation.checkId(userId);
  if (
    !firstName ||
    !lastName ||
    !email ||
    !gender ||
    !city ||
    !state ||
    !age ||
    !password ||
    !lincenceNumber
  ) {
    throw "All fields need to have valid values";
  }
  validation.checkString(firstName, "The firstName");
  validation.checkString(lastName, "The lastName");
  validation.checkString(email, "The Email");
  validation.checkString(gender, "The Gender");
  validation.checkString(city, "The City");
  validation.checkString(state, "The state");
  validation.checkString(age, "The age");
  validation.checkString(password, "The password");
  validation.checkString(lincenceNumber, "The lincenceNumber");

  //trimming the values
  firstName = validation.trimming(firstName);
  lastName = validation.trimming(lastName);
  email = validation.trimming(email);
  gender = validation.trimming(gender);
  city = validation.trimming(city);
  state = validation.trimming(state);
  age = validation.trimming(age);
  password = validation.trimming(password);
  lincenceNumber = validation.trimming(lincenceNumber);

  //validating first & last name
  let firstNameFlag = validation.checkSpecialCharWithNumber(firstName);
  if (firstName.length < 3) {
    throw `Error: firstName must be at least 3 characters`;
  }
  if (firstNameFlag === true) {
    throw `Error: Invalid Input for firstName. It contains Special Charaters / Numbers`;
  }
  let lastNameFlag = validation.checkSpecialCharWithNumber(lastName);
  if (lastName.length < 3) {
    throw `Error: lastName must be at least 3 characters`;
  }
  if (lastNameFlag === true) {
    throw `Error: Invalid Input for lastName. It contains Special Charater / Numbers`;
  }

  //validating gender
  gender = gender.toLowerCase();
  if (
    gender != "female" &&
    gender != "male" &&
    gender != "transgender" &&
    gender != "genderneutral" &&
    gender !== "nonbinary" &&
    gender !== "other"
  ) {
    throw `Error: Please select valid input for Gender (female, male, transgender, gender neutral, non-binary, other)`;
  }

  //validating city
  let cityFlag = validation.checkSpecialCharWithNumber(city);
  if (cityFlag === true) {
    throw `Error: Invalid Input for city. It contains Special Charater/Numbers`;
  }
  if (city.length < 2 || city.length > 20) {
    throw `Error: Invalid Input for city.`;
  }
  // city = city.toLowerCase();

  //validating state
  let stateFlag = validation.checkSpecialCharWithNumber(state);
  if (stateFlag === true) {
    throw `Error: Invalid Input for state. It contains Special Charater / Numbers`;
  }
  if (state.length <= 2 || state.length > 20) {
    throw `Error: Invalid Input for state. Please do not enter short forms like NJ / TX etc.`;
  }
  // state = state.toLowerCase();
  age = parseFloat(age); //TO-DO : check for 10.0 input for age??
  if (age === NaN) throw `Error: age is not a number`;
  if (age % 1 != 0) throw `Error: age contains decimal point`;

  const updatedUser = {
    firstName: firstName,
    lastName: lastName,
    gender: gender,
    city: city,
    state: state,
    age: age,
  };

  const particularUser = await getUserById(userId);
  if (particularUser === null) throw "Error: No User with that id";
  if (firstName.toLowerCase() === particularUser.firstName.toLowerCase()) {
    throw `Error: newFirstName same as the value stored in the Database`;
  }
  if (lastName.toLowerCase() === particularUser.lastName.toLowerCase()) {
    throw `Error: newLastName same as the value stored in the Database`;
  }
  if (gender.toLowerCase() === particularUser.gender.toLowerCase()) {
    throw `Error: newGender same as the value stored in the Database`;
  }
  if (city.toLowerCase() === particularUser.city.toLowerCase()) {
    throw `Error: newCity same as the value stored in the Database`;
  }
  if (state.toLowerCase() === particularUser.state.toLowerCase()) {
    throw `Error: newState same as the value stored in the Database`;
  }
  if (age === particularUser.age) { // age is a number - no need to change in lowerCase
    throw `Error: newAge same as the value stored in the Database`;
  }
  const userCollection = await users();
  const updatedInfo = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    { $set: updatedUser }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "could not update user successfully";
  }
};

//get all the users from db
const getAllUsers = async () => {
  const userCollection = await users();
  const userList = await userCollection.find({}).toArray();
  if (!userList) throw "Could not get all users";
  // moviesList._id = moviesList._id.toString();
  for (let i in userList) {
    userList[i]._id = userList[i]._id.toString();
  }
  return userList;
};

//check whether email is present in db or not
const checkUser = async (email, password) => {
  if (!email || !password) {
    throw "All fields must have valid input";
  }
  validation.checkString(email, "The Email");
  validation.checkString(password, "The Password");
  email = validation.trimming(email);
  password = validation.trimming(password);
  let userflag = validation.checkSpace(email);
  if (userflag === true) {
    throw `Error: Invalid Input for email. It contains spaces`;
  }
  let emailFlag = validation.validateEmail(email);
  if (emailFlag === false) {
    throw `Error: Invalid input for email Address`;
  }
  let passFlag = validation.checkSpace(password);
  if (passFlag === true) {
    throw `Error: Invalid Input for Password. It contains spaces`;
  }
  validation.passwordValidate(password);
  if (password.length < 8) {
    throw `Error: Password must be at least 8 characters`;
  }
  const usersCollection = await users();

  

  let dbFormatEmail = email.toLowerCase();
  //email = email.toLowerCase();


  const user = await usersCollection.findOne({ email: dbFormatEmail });

  if (!user) {
    throw `Email ${email} is not registered with us.`;
  }

  let comparePassword = false;
  comparePassword = await bcrypt.compare(password, user.password);
  if (comparePassword) {
    return { authenticatedUser: true, firstName: user.firstName, lastName: user.lastName};
  } else {
    throw `Error: Please enter correct password for email - ${email}`;
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
  checkUser,
};
