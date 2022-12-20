function checkEmail(email) {
  if (typeof email != "string") throw `Error: ${email} must be a string`;
  if (!email) throw `Please enter the email`;
  if (email.length === 0 || email.trim().length === 0)
    throw `Error: Email can not be just empty spaces`;

  const emailCorrectPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailCorrectPattern.test(email)) throw "Error: Invalid email address";

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

  if (age === NaN) throw `Error: Age must be a number`;
  if (age % 1 !== 0) throw `Error: Age must not contain decimals`;
  if (age < 1 || age > 100) throw `Error: Enter a valid input for Age`;
  return age;
}

function checkGender(gender, valName) {
  gender = checkString(gender, valName);
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
  //console.log("lincenceNumber.length..",lincenceNumber.length)
  if (lincenceNumber.length !== 15)
    throw `Error: Licence Number should be 15 char long`;
  if (/\s/g.test(lincenceNumber))
    throw `Error: Licence Number must not contain space`;

  return lincenceNumber;
}

(function ($) {
  $(".login-error-div").hide();
  $(".signup-error-div").hide();
  $(".booking-error-div").hide();

  const loginForm = $("#login-form");
  const registerForm = $("#signup-form");
  const emailSendForm = $("#email-send-form");
  const bookingForm = $("#booking-form");
  const bookingFormInput = $("#booking-form-input");
  const bookingFormCarRating = $("#booking-form-carRating");

  /*
    AJAX form to logout user 
    */
  $("#logout-form").submit(function (event) {
    event.preventDefault();

    var requestConfig = {
      method: "GET",
      url: "/protected/logout",
    };

    $.ajax(requestConfig).then(function (responseMessage) {
      //console.log('responseMessage',responseMessage)
      $("html").html(responseMessage);
    });

    //req.session.destroy();
  });

  //booking Form car rating validation
  $(bookingFormCarRating).submit(function (event) {
    event.preventDefault();
    var carRating = $("#carRating").val();
    try {
      carRating = checkString(carRating, "Car Rating");

      if (parseFloat(carRating) === NaN) {
        throw "Error: rating is not a number";
      }

      let splitRating = carRating.split("");

      if (splitRating[1] === ".") {
        if (splitRating.length !== 3) {
          throw "Error: rating should be upto only one decimal place like 2.3";
        }
      }

      if (splitRating[1] === ".") {
        if (splitRating[0] < "1" || splitRating[0] > "5") {
          throw "Error: rating should be between 1 and 5";
        }
      }

      if (splitRating[1] === ".") {
        if (splitRating[0] === "5") {
          if (splitRating[2] !== "0") {
            throw "Error: rating of 5 cannot have decimal values greater than or less than 0";
          }
        }
      }

      if (splitRating[1] === ".") {
        if (splitRating[0] >= "1" || splitRating[0] <= "5") {
          if (splitRating[2] >= 10) {
            throw "Error: rating should be between 1.0 to 4.9";
          }
        }
      }

      rating = parseFloat(carRating);

      if (rating < 1 || rating > 5) {
        throw "Error: rating should be between 1 and 5";
      }

        $(this).unbind();
        $(this).submit();
     } catch (e) {
      //console.log("error inside client validation..", e);
      $(".booking-error-div").text(e);
      $(".booking-error-div").show();
      $("#booking-form-carRating").trigger("reset");
    }
  });

  //UpdatBookingForm validation - with pickUpLocation
  $(bookingFormInput).submit(function (event) {
    event.preventDefault();
    var pickUpDate = $("#pickUpDate").val();
    var pickUpTime = $("#pickUpTime").val();
    var returnDate = $("#returnDate").val();
    var returnTime = $("#returnTime").val();
    var pickUpLocation = $("#pickUpLocation").val();
    try {
      if (
        !pickUpDate ||
        !pickUpTime ||
        !returnTime ||
        !returnDate ||
        !pickUpLocation
      ) { 
        throw "Error:Please enter all the values to book a car";
      }

      pickUpDate = checkString(pickUpDate, "Pick Up date");
      pickUpTime = checkString(pickUpTime, "Pick Up Time");
      returnTime = checkString(returnTime, "Return Time");
      returnDate = checkString(returnDate, "Return date");
      pickUpLocation = checkString(pickUpLocation, "Pickup Location");

      split = pickUpDate.split("-");
      const today = new Date();
      const year = today.getFullYear();
      let month = today.getMonth() + 1;
      let day = today.getDate();
      if (split[2] < day || split[1] < month || split[0] < year) {
        throw "Error: Cannot select PickUp Date in the past";
      }

      split2 = returnDate.split("-");
      if (
        split2[2] < split[2] ||
        split2[1] < split[1] ||
        split2[0] < split[0]
      ) {
        throw `Error: Cannot select Return Date (${returnDate}) before the PickUp date (${pickUpDate})`;
      }

      if (pickUpDate === returnDate) {
        let pickUpTimeSplit = pickUpTime.split(":");
        let returnTimeSplit = returnTime.split(":");

        if (pickUpTimeSplit[0] >= returnTimeSplit[0]) {
          if (pickUpTimeSplit[1] >= returnTimeSplit[1]) {
            throw `Error: Cannot select return time (${returnTime}) before or same as the pickup time (${pickUpTime})`;
          }
        }
      }

      if (pickUpLocation.length < 2 || pickUpLocation.length > 20) {
        throw "Error: Invalid Input for Location.";
      }

      $(this).unbind();
      $(this).submit();
    } catch (e) {
      //console.log("error inside client validation..", e);
      $(".booking-error-div").text(e);
      $(".booking-error-div").show();
      $("#booking-form").trigger("reset");
    }
  });

  //UpdatBookingForm validation
  $(bookingForm).submit(function (event) {
    event.preventDefault();
    var pickUpDate = $("#pickUpDate").val();
    var pickUpTime = $("#pickUpTime").val();
    var returnDate = $("#returnDate").val();
    var returnTime = $("#returnTime").val();
    try {
      if (!pickUpDate || !pickUpTime || !returnTime || !returnDate) {
        throw "Please enter all the values to book a car";
      }

      pickUpDate = checkString(pickUpDate, "Pick Up date");
      pickUpTime = checkString(pickUpTime, "Pick Up Time");
      returnTime = checkString(returnTime, "Return Time");
      returnDate = checkString(returnDate, "Return date");

      split = pickUpDate.split("-");
      const today = new Date();
      const year = today.getFullYear();
      let month = today.getMonth() + 1;
      let day = today.getDate();
      if (split[2] < day || split[1] < month || split[0] < year) {
        throw "Error: Cannot select PickUp Date in the past";
      }

      split2 = returnDate.split("-");
      if (
        split2[2] < split[2] ||
        split2[1] < split[1] ||
        split2[0] < split[0]
      ) {
        throw `Error: Cannot select Return Date (${returnDate}) before the PickUp date (${pickUpDate})`;
      }

      if (pickUpDate === returnDate) {
        let pickUpTimeSplit = pickUpTime.split(":");
        let returnTimeSplit = returnTime.split(":");

        if (pickUpTimeSplit[0] >= returnTimeSplit[0]) {
          if (pickUpTimeSplit[1] >= returnTimeSplit[1]) {
            throw `Error: Cannot select return time (${returnTime}) before or same as the pickup time (${pickUpTime})`;
          }
        }
      }

      $(this).unbind();
      $(this).submit();
    } catch (e) {
      //console.log("error inside client validation..", e);
      $(".booking-error-div").text(e);
      $(".booking-error-div").show();
      $("#booking-form").trigger("reset");
    }
  });

  //sendEmail validation
  $(emailSendForm).submit(function (event) {
    event.preventDefault();
    var email = $("#email").val();
    try {
      email = checkEmail(email);

      $(this).unbind();
      $(this).submit();
    } catch (e) {
      //console.log("error inside client validation..", e);
      $(".email-error-div").text(e);
      $(".email-error-div").show();
      $("#email-form").trigger("reset");
      $("#email").trigger("focus");
    }
  });

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
      //console.log("error inside client validation..", e);
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
  //payemnt validation - card validation
})(window.jQuery);
