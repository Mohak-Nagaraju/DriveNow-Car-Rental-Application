const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
const express = require("express");
const router = express.Router();
let userData = require("../data/users");
let carData = require("../data/cars");

let bookingData = require("../data/booking");

let validationForm = require("../validation");
const xss = require("xss");

//root route - Login Page
router.route("/").get(async (req, res) => {
  if (xss(req.session.email)) {
    return res.redirect("/protected/welcome");
  } else {
    return res.render("userLogin", {
      title: "Enter details to login",
    });
  }
});

//Registeration/SignUp route
router
  .route("/register")
  .get(async (req, res) => {
    if (xss(req.session.email)) {
      return res.status(200).redirect("/protected/welcome");
    } else {
      return res.render("userRegister", {
        title: "SignUp",
      });
    }
  })
  .post(async (req, res) => {
    let firstName = xss(req.body.firstName);
    let lastName = xss(req.body.lastName);
    let email = xss(req.body.email);
    let hashPassword = xss(req.body.hashPassword);
    let gender = xss(req.body.gender);
    let city = xss(req.body.city);
    let state = xss(req.body.state);
    let age = xss(req.body.age);
    let lincenceNumber = xss(req.body.lincenceNumber);

    if (xss(req.session.email)) {
      return res.redirect("/protected/welcome");
    }
    if (
      !email ||
      !hashPassword ||
      !firstName ||
      !lastName ||
      !gender ||
      !city ||
      !state ||
      !age ||
      !lincenceNumber
    ) {
      return res.status(400).render("userRegister", {
        title: "SignUp",
        error: "All fields must have valid input",
      });
    }
    //email validation
    let emailFlag = validationForm.validateEmail(email);
    if (!emailFlag || typeof email !== "string") {
      res.status(400).render("userRegister", {
        title: "SignUp",
        error:
          "Invalid input for email. Please follow the format: example@example.com",
      });
      return;
    }

    if (typeof hashPassword !== "string" || hashPassword.trim().length < 8) {
      res.status(400).render("userRegister", {
        title: "SignUp",
        error: "Enter a valid password with minimum length of 8",
      });
      return;
    }

    //firstName validation
    if (typeof firstName !== "string" || firstName.trim().length === 0) {
      res.status(400).render("userRegister", {
        title: "SignUp",
        error: "Enter a valid first name",
      });
      return;
    }

    //lastName validation
    if (typeof lastName !== "string" || lastName.trim().length === 0) {
      res.status(400).render("userRegister", {
        title: "SignUp",
        error: "Enter a valid last name",
      });
      return;
    }

    //age validation
    if (
      typeof age !== "string" ||
      age < 1 ||
      age > 100 ||
      age == "" ||
      age % 1 != 0
    ) {
      res.status(400).render("userRegister", {
        title: "SignUp",
        error: "Enter a valid age",
      });
      return;
    }

    //lincenceNumber validation
    let licenseNumberFlag = validationForm.checkSpace(lincenceNumber);
    if (
      licenseNumberFlag ||
      typeof lincenceNumber !== "string" ||
      lincenceNumber.trim().length !== 15
    ) {
      res.status(400).render("userRegister", {
        title: "SignUp",
        error: "Enter a valid 15 digit license number with no space",
      });
      return;
    }

    try {
      let result = await userData.createUser(
        firstName,
        lastName,
        email,
        gender,
        city,
        state,
        age,
        hashPassword,
        lincenceNumber
      );

      if (result.insertedUser) {
        //req.session.email = result.email;
        // res.status(200).redirect("/"); //redirect to login
        res.status(200).redirect("/sendEmail");
        return;
      } else {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    } catch (error) {
      return res.status(500).render("userRegister", {
        title: "SignUp",
        error: error.message ? error.message : error,
      });
    }
  });

router.route("/sendEmail").get(async (req, res) => {
  //if (xss(req.session.email)) {
  // might have to check if booking is done successfull or not
  // console.log("inside sendEmail.. email -", req.session.email);
  res.render("sendEmailPage", {
    title: "Email Communication",
  });
  return;
  // }
});

router.route("/login").post(async (req, res) => {
  if (xss(req.session.email)) {
    return res.redirect("/protected/welcome");
  }
  //const { email, hashPassword } = req.body;
  const email = xss(req.body.email);
  const hashPassword = xss(req.body.hashPassword);

  if (!email || !hashPassword) {
    return res.status(400).render("userLogin", {
      title: "Enter details to login",
      error: "Please enter email and password",
    });
  }
  //email validation
  let emailFlag = validationForm.validateEmail(email);
  if (!emailFlag || typeof email !== "string") {
    res.status(400).render("userRegister", {
      title: "SignUp",
      error:
        "Invalid input for email. Please follow the format: example@example.com",
    });
    return;
  }

  //password validation
  if (typeof hashPassword !== "string" || hashPassword.trim().length < 8) {
    res.status(400).render("userLogin", {
      title: "Enter details to login",
      error: "Enter a valid password",
    });
    return;
  }

  try {
    //checking if user if available in our db
    let result = await userData.checkUser(email, hashPassword);

    if (result.authenticatedUser) {
      req.session.firstName = result.firstName;
      req.session.lastName = result.lastName;
      req.session.email = email;

      req.session.name = "AuthCookie";

      res.status(200).redirect("/protected/welcome");

      return;
    }
  } catch (error) {
    return res.status(400).render("userLogin", {
      title: "Enter details to login",
      error: error.message ? error.message : error,
    });
  }
});

// router.route("/protected/welcome").get(async (req, res) => {
//   if (xss(req.session.email)) {
//     return res.render("welcomePage", {
//       title: "Welcome",
//       firstName: xss(req.session.firstName),
//       lastName: xss(req.session.lastName),
//       success: 'Money Added'
//     });
//   } else {
//     return res
//       .status(403)
//       .render("forbiddenAccess", { title: "Forbidden Access" });
//   }
// });

// Mohak:- I don't think we need this anymore, refer line 225-232

/* router.route("/welcome").get(async (req, res) => {
  //console.log("email in welcome page..", req.session.email);
  res.render("welcomePage", {
    title: "Welcome",
    name: req.session.email,
    //Poorvi's code should go here
  });
}); */

router
  .route("/protected/booking")
  .get(async (req, res) => {
    if (xss(req.session.email)) {
      return res.render("booking", {
        title: "Booking",
        name: xss(req.session.email),
      });
    } else {
      return res
        .status(403)
        .render("forbiddenAccess", { title: "Forbidden Access" });
    }
  })
  .post(async (req, res) => {
    //let amountPaid = req.body.amountPaid;
    if (xss(req.session.email)) {
      let pickUpDate = xss(req.body.pickUpDate);
      let pickUpTime = xss(req.body.pickUpTime);
      let returnTime = xss(req.body.returnTime);
      let returnDate = xss(req.body.returnDate);
      let pickUpLocation = xss(req.body.pickUpLocation);

      if (
        !pickUpDate ||
        !pickUpTime ||
        !returnTime ||
        !returnDate ||
        !pickUpLocation
      ) {
        return res.status(400).render("booking", {
          title: "Booking Details",
          error: "Please enter all the values to book a car",
        });
      }

      try {
        validationForm.checkString(pickUpDate);
        validationForm.checkString(pickUpTime);
        validationForm.checkString(returnDate);
        validationForm.checkString(returnTime);
        validationForm.checkString(pickUpLocation);
      } catch (error) {
        return res.status(400).render("booking", {
          title: "Booking",
          error: error.message ? error.message : error,
        });
      }

      validationForm.trimming(pickUpDate);
      validationForm.trimming(pickUpTime);
      validationForm.trimming(returnDate);
      validationForm.trimming(returnTime);
      validationForm.trimming(pickUpLocation);

      if (
        pickUpDate.length === 0 ||
        pickUpTime.length === 0 ||
        returnDate.length === 0 ||
        returnTime.length === 0 ||
        pickUpLocation.length === 0
      ) {
        return res.status(400).render("booking", {
          title: "Booking Details",
          error: error.message ? error.message : error,
        });
      }

      //let s = "2021-12-16"
      split = pickUpDate.split("-");
      const today = new Date();
      const year = today.getFullYear();
      let month = today.getMonth() + 1;
      let day = today.getDate();
      if (split[2] < day || split[1] < month || split[0] < year) {
        return res.status(403).render("booking", {
          title: "Booking Details",
          error: "Error: Cannot select PickUp Date in the past",
        });
      }

      split2 = returnDate.split("-");
      if (
        split2[2] < split[2] ||
        split2[1] < split[1] ||
        split2[0] < split[0]
      ) {
        return res.status(403).render("booking", {
          title: "Booking Details",
          error: `Error: Cannot select Return Date (${returnDate}) before the PickUp date (${pickUpDate})`,
        });
      }

      if (pickUpDate === returnDate) {
        let pickUpTimeSplit = pickUpTime.split(":");
        let returnTimeSplit = returnTime.split(":");

        if (pickUpTimeSplit[0] >= returnTimeSplit[0]) {
          if (pickUpTimeSplit[1] >= returnTimeSplit[1]) {
            return res.status(403).render("booking", {
              title: "Booking Details",
              error: `Error: Cannot select return time (${returnTime}) before or same as the pickup time (${pickUpTime})`,
            });
          }
        }
      }

      if (pickUpLocation.length < 2 || pickUpLocation.length > 20) {
        return res.status(403).render("booking", {
          title: "Booking Details",
          error: "Error: Invalid Input for Location.",
        });
      }

      req.session.pickUpDate = pickUpDate;
      req.session.pickUpTime = pickUpTime;
      req.session.returnTime = returnTime;
      req.session.returnDate = returnDate;
      req.session.pickUpLocation = pickUpLocation;
      req.session.booking = "true";
      //return res.render("viewCars", {title: "Select Car", name: req.session.email});
      return res.redirect("/protected/viewCars");
    } else {
      return res
        .status(403)
        .render("forbiddenAccess", { title: "Forbidden Access" });
    }

    //check another way to validate booking page - if user has pressed submit or not
  });

router
  .route("/protected/viewCars")
  .get(async (req, res) => {
    if (xss(req.session.email)) {
      if (xss(req.session.booking) === "true") {
        // console.log("inside booking session");
        try {
          let cars = await carData.getCarLocation(
            xss(req.session.pickUpLocation)
          );
          return res
            .status(200)
            .render("viewCars", { title: "Select Car", car: cars });
        } catch (error) {
          //console.log("inside no car found by location", cars);
          return res.status(400).render("error", {
            title: "Issue with the car availaibility",
            error: error.message ? error.message : error,
          });
        }
      } 
      else {
        return res.status(403).render("error", {
          title: "Issue with Booking deatils",
          error:
            "Cannot access Car Information/selection page until you have entered the Boooking details",
        });
      }
    } else {
      return res
        .status(403)
        .render("forbiddenAccess", { title: "Forbidden Access" });
    }
  })
  .post(async (req, res) => {
    //console.log("carSelectedDetails...", req.body);
    req.session.carSelectedId = xss(req.body.carSelect);
    req.session.paymentSelected = xss(req.body.paymentSelect);

    let carSelectedDetails = await carData.getCarById(
      xss(req.session.carSelectedId)
    );

    if (!xss(req.body.carSelect)) {
      return res.status(400).render("viewCars", {
        title: "Please select a Car to book",
        error: error.message ? error.message : error,
      });
    }

    let costPerHour = carSelectedDetails.costPerHour;
    let pickUpTimeSplit = req.session.pickUpTime.split(":"); //[h,m]
    let returnTimeSplit = req.session.returnTime.split(":");
    let pickUpDate = req.session.pickUpDate.split("-");
    let returnDate = req.session.returnDate.split("-");
    if (pickUpDate[2] === returnDate[2]) {
      if (pickUpTimeSplit[1] < returnTimeSplit[1]) {
        let hours =
          Math.abs(
            parseFloat(pickUpTimeSplit[0]) - parseFloat(returnTimeSplit[0])
          ) + 1;
        let cost = costPerHour.slice(1);
        var total = Number(cost) * hours;
      } else {
        let hours = Math.abs(
          parseFloat(pickUpTimeSplit[0]) - parseFloat(returnTimeSplit[0])
        );
        let cost = costPerHour.slice(1);
        var total = Number(cost) * hours;
      }
    } else {
      let diff = Number(returnDate[2]) - Number(pickUpDate[2]);
      let cost = costPerHour.slice(1);
      var total = Number(cost) * diff * 24;
    }

    req.session.cost = total;

    if (carSelectedDetails.availability === "no") {
      return res.status(500).render("error", {
        title: "Payment thru Wallet",
        error: 'Error: Can not book an unavailable car.',
        temp: 'true'
      });
    }

    if (xss(req.session.paymentSelected) === "creditCard") {
      return res.status(200).render("paymentPage", {
        title: "Payment thru Credit Card",
        totalCost: total,
      });
    } else {
      try {
        let userDetails = await userData.getUserByEmail(xss(req.session.email));
        if (userDetails.walletAmount < req.session.cost) {
          return res.status(500).render("walletError", {
            title: "Error",
            total: req.session.cost,
            wallet: userDetails.walletAmount,
          });
        }
        return res.status(200).render("walletPayment", {
          title: "Payment thru Wallet",
          walletBalance: userDetails.walletAmount,
          totalCost: total,
        });
      } catch (error) {
        // to do - parul have to decide where to catch this error
        return res.status(500).render("walletPayment", {
          title: "Payment thru Wallet",
          error: error.message ? error.message : error,
        });
      }
      // console.log("user with email..", userDetails);
      // userDetails.walletAmount = moneyAdded;
    }

    // return res.redirect("/protected/payment");
    //console.log("after form..",req.body.carSelect)
  });

//if booking successfull - route to payment
router
  .route("/protected/payment")
  .get(async (req, res) => {
    if (xss(req.session.email)) {
      // might have to check if booking is done successfull or not
      // console.log("inside if .. emai -", req.body);
      res.render("paymentPage", { title: "Payment" });
      return;
    }
    return res.render("userLogin", {
      title: "Enter details to login",
    });
  })
  .post(async (req, res) => {
    let cardNumber = xss(req.body.cardNumber);
    let name = xss(req.body.cardName);
    let cvv = xss(req.body.cardCvv);
    let expriy = xss(req.body.cardExpiry);
    //let amount = xss(req.body.moneyAdded);

    // console.log('cardNumber..',cardNumber)
    // console.log('name..',name)
    // console.log('cvv..',cvv)
    // console.log('ex..',expriy)
    // console.log('am..',amount)

    if (!cardNumber || !name || !cvv || !expriy) {
      return res.status(400).render("viewCars", {
        title: "Wallet",
        error: "Please enter all the values to add money to wallet",
        temp: 'true'
      });
    }

    if (name.trim().length === 0 || typeof name !== "string") {
      return res.status(400).render("viewCars", {
        title: "Payment thru Credit Card",
        error: "Please enter valid name",
        temp: 'true'
      });
    }
    let nameSpecChar = validationForm.checkSpecialCharWithNumber(name);
    if (nameSpecChar === true) {
      return res.status(400).render("viewCars", {
        title: "Payment thru Credit Card",
        error: "Please enter valid name",
        temp: 'true'
      });
    }

    if (
      cardNumber.trim().length === 0 ||
      cardNumber.trim().length !== 16 ||
      typeof cardNumber !== "string"
    ) {
      return res.status(400).render("viewCars", {
        title: "Payment thru Credit Card",
        error: "Please enter valid card number",
        temp: 'true'
      });
    }
    // //if(cardNumber.trim().replace())
    // let validCardNumber = cardNumber
    //   .trim()
    //   .replace(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?/]+/gi, "");
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?/]+/g.test(cardNumber)) {
      //throw "Error: City must not contain any special chars or numbers";
      return res.status(400).render("viewCars", {
        title: "Payment thru Credit Card",
        error: "Please enter valid card number with no special char",
        temp: 'true'
      });
    }

    if (/\s/g.test(cardNumber)) {
      return res.status(400).render("viewCars", {
        title: "Payment thru Credit Card",
        error: "Please enter valid card number with no spaces",
        temp: 'true'
      });
    }

    //cvv validation
    // let regex = new RegExp(/^[0-9]{3,4}$/);

    if (
      cvv.trim().length === 0 ||
      cvv.trim().length > 3 ||
      typeof cvv !== "string" ||
      cvv < 0
    ) {
      return res.status(400).render("viewCars", {
        title: "Payment thru Credit Card",
        error: "Please enter valid 3 digit cvv",
        temp: 'true'
      });
    }
    cvv = cvv.trim();
    if (!/^[0-9]{3}$/.test(cvv)) {
      return res.status(400).render("viewCars", {
        title: "Payment thru Credit Card",
        error: "Please enter valid 3 digit cvv",
        temp: 'true'
      });
    }
    let validCvv = cvv.trim().replace(/[@#$%^&*_+\=\\`|<>\/]/gi, "");
    if (cvv.trim() !== validCvv) {
      //throw "Error: City must not contain any special chars or numbers";
      return res.status(400).render("viewCars", {
        title: "Payment thru Credit Card",
        error: "Please enter valid cvv number with no special char",
        temp: 'true'
      });
    }

    if (
      /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/.test(expriy) === false ||
      Number(expriy.charAt(3) + expriy.charAt(4)) < 22
    ) {
      return res.status(400).render("viewCars", {
        title: "Payment thru Credit Card",
        error: `Please enter valid expiry number in the format - MM/YY - you entered - ${expriy}`,
        temp: 'true'
      });
    }

    let userDetails = await userData.getUserByEmail(xss(req.session.email));
    req.session.userId = userDetails._id.toString();
    let bookingDetails = await bookingData.createBooking(
      xss(userDetails._id.toString()),
      xss(req.session.carSelectedId),
      xss(req.session.cost), // amountPaid - TO DO
      xss(req.session.pickUpDate),
      xss(req.session.pickUpTime),
      xss(req.session.returnTime),
      xss(req.session.returnDate),
      xss(req.session.pickUpLocation)
    );

    // put eveything in session
    //console.log("booking detaiks...", bookingDetails);
    //return res.status(200).redirect("/sendEmail");
    return res.render("successBooking", {
      title: "Success!!",
      pickUpDate: xss(req.session.pickUpDate),
      pickUpTime: xss(req.session.pickUpTime),
      returnTime: xss(req.session.returnTime),
      returnDate: xss(req.session.returnDate),
      pickUpLocation: xss(req.session.pickUpLocation),
    });
  });

router.route("/protected/welcome").get(async (req, res) => {
  if (xss(req.session.email)) {
    console.log("inside protected welcome ");
    if (req.session.moneyAdded === "true") {
      //console.log("inside protected welcome success money added");
      req.session.moneyAdded = "false";
      return res.status(200).render("welcomePage", {
        firstName: xss(req.session.firstName),
        lastName: xss(req.session.lastName),
        success: "Money Added to wallet",
      });
    } else {
      return res.status(200).render("welcomePage", {
        firstName: xss(req.session.firstName),
        lastName: xss(req.session.lastName),
      });
    }
  } else {
    return res
      .status(403)
      .render("forbiddenAccess", { title: "Forbidden Access" });
  }
});

// Mohak:- I don't think we need this anymore, refer line 225-232

/* router.route("/welcome").get(async (req, res) => {
  //console.log("email in welcome page..", req.session.email);
  res.render("welcomePage", {
    title: "Welcome",
    name: req.session.email,
    //Poorvi's code should go here
  });
}); */

router.route("/protected/logout").get(async (req, res) => {
  //code here for GET
  if (xss(req.session.email)) {
    req.session.destroy();
    res.render("logout", {
      title: "Logged Out",
    });
    return;
  } else {
    // whhere should it go? - TO DO
  }
});

router
  .route("/protected/walletMoneyUpdate")
  .get(async (req, res) => {
    if (xss(req.session.email)) {
      let userDetails = await userData.getUserByEmail(xss(req.session.email));
      let availableWalletMoney = userDetails.walletAmount;
      //console.log("availableWalletMoney..", availableWalletMoney);
      res.render("walletMoneyUpdatePage", {
        title: "Wallet",
        availableWalletMoney: availableWalletMoney,
      });
      return;
    }
    return res
      .status(403)
      .render("forbiddenAccess", { title: "Forbidden Access" });
  })
  .post(async (req, res) => {
    let cardNumber = xss(req.body.cardNumber);
    let name = xss(req.body.cardName);
    let cvv = xss(req.body.cardCvv);
    let expriy = xss(req.body.cardExpiry);
    //let amount = xss(req.body.moneyAdded);

    // console.log('cardNumber..',cardNumber)
    // console.log('name..',name)
    // console.log('cvv..',cvv)
    // console.log('ex..',expriy)
    // console.log('am..',amount)

    if (!cardNumber || !name || !cvv || !expriy) {
      return res.status(400).render("viewCars", {
        title: "Wallet",
        error: "Please enter all the values to add money to wallet",
      });
    }

    if (name.trim().length === 0 || typeof name !== "string") {
      return res.status(400).render("walletMoneyUpdatePage", {
        title: "Wallet",
        error: "Please enter valid name",
      });
    }
    let nameSpecChar = validationForm.checkSpecialCharWithNumber(name);
    if (nameSpecChar === true) {
      return res.status(400).render("walletMoneyUpdatePage", {
        title: "Wallet",
        error: "Please enter valid name",
      });
    }

    if (
      cardNumber.trim().length === 0 ||
      cardNumber.trim().length !== 16 ||
      typeof cardNumber !== "string"
    ) {
      return res.status(400).render("walletMoneyUpdatePage", {
        title: "Wallet",
        error: "Please enter valid card number",
      });
    }
    // //if(cardNumber.trim().replace())
    // let validCardNumber = cardNumber
    //   .trim()
    //   .replace(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?/]+/gi, "");
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?/]+/g.test(cardNumber)) {
      //throw "Error: City must not contain any special chars or numbers";
      return res.status(400).render("walletMoneyUpdatePage", {
        title: "Wallet",
        error: "Please enter valid card number with no special char",
      });
    }

    if (/\s/g.test(cardNumber)) {
      return res.status(400).render("walletMoneyUpdatePage", {
        title: "Wallet",
        error: "Please enter valid card number with no spaces",
      });
    }

    //cvv validation
    // let regex = new RegExp(/^[0-9]{3,4}$/);

    if (
      cvv.trim().length === 0 ||
      cvv.trim().length > 3 ||
      typeof cvv !== "string" ||
      cvv < 0
    ) {
      return res.status(400).render("walletMoneyUpdatePage", {
        title: "Wallet",
        error: "Please enter valid 3 digit cvv",
      });
    }
    cvv = cvv.trim();
    if (!/^[0-9]{3}$/.test(cvv)) {
      return res.status(400).render("walletMoneyUpdatePage", {
        title: "Wallet",
        error: "Please enter valid 3 digit cvv",
      });
    }
    let validCvv = cvv.trim().replace(/[@#$%^&*_+\=\\`|<>\/]/gi, "");
    if (/[@#$%^&*_+\=\\`|<>\/]/g.test(cvv)) {
      //throw "Error: City must not contain any special chars or numbers";
      return res.status(400).render("walletMoneyUpdatePage", {
        title: "Wallet",
        error: "Please enter valid cvv number with no special char",
      });
    }

    if (
      /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/.test(expriy) === false ||
      Number(expriy.charAt(3) + expriy.charAt(4)) < 22
    ) {
      return res.status(400).render("walletMoneyUpdatePage", {
        title: "Wallet",
        error: `Please enter valid expiry number in the format - MM/YY - you entered - ${expriy}`,
      });
    }
    let moneyAdded = xss(req.body.moneyAdded);

    if (
      moneyAdded < 0 ||
      moneyAdded.trim().length === 0 ||
      typeof moneyAdded !== "string"
    ) {
      return res.status(400).render("walletMoneyUpdatePage", {
        title: "Wallet",
        error: `Please enter valid Amount`,
      });
    }
    //money added value

    let userDetails = await userData.getUserByEmail(xss(req.session.email));
    //console.log("user with email..", userDetails);

    let updatedWallet = await userData.updateUserWallet(
      userDetails._id,
      moneyAdded
    );
    // console.log("updateUserWallet..", updatedWallet);

    req.session.moneyAdded = "true";
    //userDetails.walletAmount = moneyAdded;

    // return res.render("welcomePage", {
    //   success: `Email has been sent to : ${toEmail} for further communication.`,
    // });

    return res.redirect("/protected/welcome");
  });

router
  .route("/protected/manageBooking")
  .get(async (req, res) => {
    if (xss(req.session.email)) {
      let userDetails = await userData.getUserByEmail(xss(req.session.email));
      userDetails._id = userDetails._id.toString();
      try {
        var bookingDetails = await bookingData.getBookingByUserId(
          userDetails._id
        );
        return res.render("manageBooking", {
          title: "Manage Booking",
          bookId: bookingDetails,
        });
      } catch (e) {
        return res.render("error", {
          title: "Error",
          error: "You have no Booking currently!",
        });
      }


    }
    return res
      .status(403)
      .render("forbiddenAccess", { title: "Forbidden Access" });
  })
  .post(async (req, res) => {

  });

router
  .route("/protected/walletMoneyUpdateSuccess")
  .get(async (req, res) => {
    if (xss(req.session.email)) {
      let userDetails = await userData.getUserByEmail(xss(req.session.email));
      let availableWalletMoney = req.session.cost - userDetails.walletAmount;
     
      res.render("walletMoneyUpdatePage", {
        title: "Wallet",
        availableWalletMoney: availableWalletMoney,
      });
      return;
    }
    return res
      .status(403)
      .render("forbiddenAccess", { title: "Forbidden Access" });
  })
  .post(async (req, res) => {
  //console.log('session...',req.session);
  let userDetails = await userData.getUserByEmail(xss(req.session.email));
  req.session.userId = userDetails._id.toString();
  let pastWalletAmount = userDetails.walletAmount;
  pastWalletAmount = parseFloat(pastWalletAmount);
 
let totalWalletAmount = pastWalletAmount - req.session.cost;


  const updatedUser = {
    walletAmount: totalWalletAmount.toString(),
  };
  const userCollection = await users();
  const updatedInfo = await userCollection.updateOne(
    { _id: ObjectId(req.session.userId) },
    { $set: updatedUser }
  );
  let bookingDetails = await bookingData.createBooking(
    xss(userDetails._id.toString()),
      xss(req.session.carSelectedId),
      xss(req.session.cost), // amountPaid - TO DO
      xss(req.session.pickUpDate),
      xss(req.session.pickUpTime),
      xss(req.session.returnTime),
      xss(req.session.returnDate),
      xss(req.session.pickUpLocation)
    );

    //console.log("booking detaiks...", bookingDetails);

    //return res.status(200).redirect("/sendEmail");
    res.render("successBooking", {
      title: "Success!!",
      pickUpDate: xss(req.session.pickUpDate),
      pickUpTime: xss(req.session.pickUpTime),
      returnTime: xss(req.session.returnTime),
      returnDate: xss(req.session.returnDate),
      pickUpLocation: xss(req.session.pickUpLocation),
    });
  });



module.exports = router;
