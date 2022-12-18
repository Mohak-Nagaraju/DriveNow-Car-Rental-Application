function checkEmail(email) {
  if (typeof email != "string") throw `Error: ${email} must be a string`;
  if (!email) throw `Please enter the email`;
  if (email.length === 0 || email.trim().length === 0)
    throw `Error: Email can not be just empty spaces`;

  const emailCorrectPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailCorrectPattern.test(email))
    throw "Error: Invalid email address";

  return email;
}

function checkPassword(password) {
  if (!password) throw `Please enter the password`;
  if (password.trim().length === 0)
    throw `Error: Passoword can not be just empty spaces`;
  if (password.trim().length < 8)
    throw `Error: Minimum length for password is 8`;
  //TO-DO maybe more validations?
  return password;
}

function checkString(value, valName) {
  if (!value) throw `Error: Please provide the ${valName}`;
  if (typeof value !== "string") throw `Error: ${valName} must be a string`;
  if (value.trim().length === 0)
    throw `Error: ${valName} can not be just empty spaces`;
  return value;
}

function checkAge(age, valName) {
  age = checkString(age, valName);
  //age = parseFloat(age);

  //TO-DO: check for age 10.0???

  console.log("age after parseFloat..", parseFloat(age));
  console.log("age after modulus..", (age %1));
  if (age === NaN) throw `Error: Age must be a number`;
  if (age % 1 !== 0) throw `Error: Age must not contain decimals`;
  if(age<1 || age >100) throw `Error: Enter a valid input for Age`
  return age;
}

function checkGender(gender, valName) {
  gender = checkString(gender, valName);
  gender  = gender.toLowerCase();
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
}

function checkCity(city, valName) {
  city = checkString(city, valName);
  //no numbers or special characters
  let validCity = city.trim().replace(/[@#$%^&*_+\=\\`|0-9<>\/]/gi, "");
  if (city.trim() !== validCity) {
    throw "Error: City must not contain any special chars or numbers";
  }
  if (city.trim().length < 2 || city.trim().length > 20) {
    throw `Error: Invalid entry for City.`;
  }
  return city;
}

function checkState(state, valName) {
  state = checkString(state, valName);
  //no numbers or special characters
  let validState = state.trim().replace(/[@#$%^&*_+\=\\`|0-9<>\/]/gi, "");
  if (state.trim() !== validState) {
    throw "Error: State must not contain any special chars or numbers";
  }
  if (state.trim().length <= 1 || state.trim().length > 20) {
    throw `Error: Invalid entry for State - client validation`;
  }
  return state;
}

function checkLincenceNumber(lincenceNumber, valName) {
  lincenceNumber = checkString(lincenceNumber, valName);
  console.log("lincenceNumber.length..",lincenceNumber.length)
  if(lincenceNumber.length !== 15) throw `Error: Licence Number should be 15 char long`;
  if (/\s/g.test(lincenceNumber))
    throw `Error: Licence Number must not contain space`;
 
  return lincenceNumber;
}

function checkDate(value, valName) {
  value = checkString(value, valName);
  if (!value) throw 'Error: Please select date';
  if((value.getMonth()+1!=month)||(value.getDate()!=day)||(value.getFullYear()!=year)) throw `Error: date invalid`;
  return value;
}

function checkTime(value, valName) {
  value = checkString(value, valName);
  if (!value) throw 'Error: Please select Time';
  if((value.getUTCHours() != hours)||(value.getUTCMinutes()!= day)||(value.getUTCSeconds()!= year)) throw `Error: Time invalid`;
  return value;
}

function checkCardNumber(cardNumber, valName) {
  lincenceNumber = checkString(lincenceNumber, valName);
  console.log("cardNumber.length..",cardNumber.length)
  if(cardNumber.length !== 12) throw `Error: card Number should be 12 char long`;
  if (/\s/g.test(lincenceNumber))
    throw `Error: card Number must not contain space`;
  return cardNumber;

}

function checkCvv(cvv, valName) {
  cvv = checkString(cvv, valName);
  if (!cvv) throw 'Error: Please enter cvv';
  console.log("cvv.length..",cvv.length)
  if(cvv.length !== 12) throw `Error: cvv should be 3 char long`;
  if (/\s/g.test(cvv))
    throw `Error: cvv must not contain space`;
  return cvv;
}

function checkExpiry(cardExpiry, valName) {
  cardExpiry = checkString(cardExpiry, valName);
  if (!cardExpiry) throw 'Error: Please enter cardExpiry';
  return cardExpiry;
}

function checkAmount(moneyAdded, valName) {
  moneyAdded = checkString(moneyAdded, valName);
  if (!moneyAdded) throw 'Error: Please enter amount to add in wallet';
  if (typeof moneyAdded != 'number') throw 'Error: Please enter amount in number format';
  if (moneyAdded < 10) throw 'Error: amount to add in wallet should be greate than 10';
  return moneyAdded;
}

(function ($) {
  $(".login-error-div").hide();
  $(".signup-error-div").hide();

  const loginForm = $("#login-form");
  const registerForm = $("#signup-form");

  //login form validation
  $(loginForm).submit(function (event) {
    event.preventDefault();
    var email = $("#email").val();
    var password = $("#hashPassword").val();
    try {
      email = checkEmail(email);
      password = checkPassword(password);

      $(this).unbind();
      $(this).submit();
    } catch (e) {
      console.log("error inside client validation..", e);
      $(".login-error-div").text(e);
      $(".login-error-div").show();
      $("#login-form").trigger("reset");
      $("#email").trigger("focus");
    }
  });

  //signUp form validation
  $(registerForm).submit(function (event) {
    event.preventDefault();
    var email = $("#email").val();
    var password = $("#hashPassword").val();
    var firstName = $("#firstName").val();
    var lastName = $("#lastName").val();
    var age = $("#age").val();
    var gender = $("#gender").val();
    var city = $("#city").val();
    var state = $("#state").val();
    var lincenceNumber = $("#lincenceNumber").val();

    try {
      email = checkEmail(email);
      password = checkPassword(password);
      firstName = checkString(firstName, "First Name");
      lastName = checkString(lastName, "Last Name");
      age = checkAge(age, "Age");
      gender = checkGender(gender, "Gender");
      city = checkCity(city, "City");
      state = checkState(state, "State");
      lincenceNumber = checkLincenceNumber(lincenceNumber, "Lincence Number");

      $(this).unbind();
      $(this).submit();
      //alert('Sign up successfull'); // To-DO
    } catch (e) {
      console.log(e);
      $(".signup-error-div").text(e);
      $(".signup-error-div").show();
      //$("#signup-form").trigger("reset");
    }
  });


  //booking validtions 
  $(bookingForm).submit(function (event) {
    event.preventDefault();
    var pickUpDate = $("#pickUpDate").val();
    var pickUpTime = $("#pickUpTime").val();
    var returnDate = $("#returnDate").val();
    var returnTime = $("#returnTime").val();
    var pickUpLocation = $("#pickUpLocation").val();
    

    try {
      pickUpDate = checkDate(pickUpDate, "PickUp Date");
      pickUpTime = checkTime(pickUpTime, "PickUp Time");
      returnTime = checkTime(returnTime, "return Time");
      returnDate = checkString(returnDate, "return Date");
      pickUpLocation = checkString(pickUpLocation, "pickUpLocation");
  
      $(this).unbind();
      $(this).submit();
      //alert('Booking successfull'); // To-DO
    } catch (e) {
      console.log(e);
      $(".booking-error-div").text(e);
      $(".booking-error-div").show();
      //$("#booking-form").trigger("reset");
    }
  });
  
  //payemnt validation - card validation
  $(paymentForm).submit(function (event) {
    event.preventDefault();
    var cardNumber = $("#cardNumber").val();
    var cardName = $("#cardName").val();
    var cardCvv = $("#cardCvv").val();
    var cardExpiry = $("#cardExpiry").val();
    

    try {
      cardNumber = checkCardNumber(cardNumber, "card Number");
      cardName = checkString(cardName, "card Name");
      cardCvv = checkCvv(cardCvv, "card Cvv");
      cardExpiry = checkExpiry(cardExpiry, "card Expiry");
    
      $(this).unbind();
      $(this).submit();
      //alert('payment successfull'); // To-DO
    } catch (e) {
      console.log(e);
      $(".payment-error-div").text(e);
      $(".payment-error-div").show();
      //$("#payment-form").trigger("reset");
    }
 
  });

  //wallet validation
  $(walletForm).submit(function (event) {
    event.preventDefault();
    var cardNumber = $("#cardNumber").val();
    var cardName = $("#cardName").val();
    var cardCvv = $("#cardCvv").val();
    var cardExpiry = $("#cardExpiry").val();
    var moneyAdded = $('#moneyAdded').val();
    

    try {
      cardNumber = checkCardNumber(cardNumber, "card Number");
      cardName = checkString(cardName, "card Name");
      cardCvv = checkCvv(cardCvv, "card Cvv");
      cardExpiry = checkExpiry(cardExpiry, "card Expiry");
      moneyAdded = checkAmount(moneyAdded, "money Added");
    
      $(this).unbind();
      $(this).submit();
      //alert('wallet update action successfull'); // To-DO
    } catch (e) {
      console.log(e);
      $(".walletAmount-error-div").text(e);
      $(".walletAmount-error-div").show();
      //$("#wallet-form").trigger("reset");
    }
 
  });

})(window.jQuery);
