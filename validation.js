const {ObjectId} = require('mongodb');

function checkString(str, variableName) {
    if (typeof str !== "string") {
        throw `${variableName || 'provided variable'} must be a string`;
    }
  
    if (str.trim().length === 0) {
        throw `${variableName || 'provided variable'} cannot be an empty string or just spaces.`;
  
    }
  
  }
  function trimming(str){
    return str.trim();
  }
  function checkSpecialChar(string)
  {
      let regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
      if(regex.test(string)){
        return true;
      } else {
        return false;
      }
  }
  function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
  function checkSpecialCharWithNumber(string)
  {
      let regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?/\d/]+/;
      if(regex.test(string)){
        return true;
      } else {
        return false;
      }
  }
  function checkId(id) {
    if (!id) throw `Error: You must provide a ${varName}`;
    if (typeof id !== 'string') throw `Error:${varName} must be a string`;
    id = id.trim();
    if (id.length === 0)throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
    return id;
}
function checkSpace(string) {
    return /\s/g.test(string);
  }
  function passwordValidate(string) {
    //let regex = new RegExp("^(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$");
    let regex = new RegExp("^(?=.*\\d)(?=.*[-+_!@#$%^&*.,?])");
    if((/[A-Z]+/.test(string[0]))===false)
    {
      throw `Error: Invalid input, Please enter a valid Password`;
    }
   if((/[0-9]+/.test(string))===false){
    throw `Error: Invalid input, Please enter a valid Password`;
  } 
  if((/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(string))===false){
    throw `Error: Invalid input, Please enter a valid Password`;
  } 
  }
  function checkNumber(string)
  {
      let regex = /^\d+$/;
      if(regex.test(string)){
        return true;
      } else {
        return false;
      }
  }
  function convertToHours(mintes) {
    const hours = Math.floor(mintes / 60);
    return { hours};
  }
  module.exports={
    checkString,
    trimming,
    checkSpecialChar,
    validateEmail,
    checkSpecialCharWithNumber,
    checkId,
    checkSpace,
    passwordValidate,
    checkNumber,
    convertToHours
  };