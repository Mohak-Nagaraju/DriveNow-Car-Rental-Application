const express = require("express");
const router = express.Router();
let userData = require("../data/users");

let validationForm = require("../validation");

//root route - login/registration page
router.route("/").get(async (req, res) => {
  if (req.session.email) {
    //console.log("inside / get..", req.session.email);
    return res.redirect("/protected/welcome");
    //res.redirect("/welcome");
    
  }
  else{
   return res.render("userLogin", {
      title: "Enter details to login",
      // registrationTrue: "Registered succesfully!"
    });
  }
  
});

router
  .route("/register")
  .get(async (req, res) => {
    if (req.session.email) {
      //res.redirect("/welcome");
      //return res.status(200).redirect("/welcome");
      return res.status(200).redirect("/protected/welcome");
      
    }
    else{
     return res.render("userRegister", {
        title: "SignUp",
      });
    }
    
  })
  .post(async (req, res) => {
    const {
      firstName,
      lastName,
      email,
      hashPassword,
      gender,
      city,
      state,
      age,
      lincenceNumber,
    } = req.body;
    if (req.session.email){
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

    //password validation
    /* let passwordFlag = validationForm.passwordValidate(hashPassword)
    if (passwordFlag === true) {
      throw `Error: Invalid Input for Password. It contains spaces`;
    }
    validation.passwordValidate(password);
    if (password.length < 8) {
      throw `Error: Password must be at least 8 characters`;
    } */

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
        error: "Enter a valid license number with no space",
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
      //when created succesfully, should return - return { insertedUser: true };
      if (result.insertedUser) {
        res.status(200).redirect("/"); //redirect to login
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

router.route("/login").post(async (req, res) => {
  if (req.session.email){
    return res.redirect("/protected/welcome");
  }
  const { email, hashPassword } = req.body;
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
      //registrationFalse:"Registration is unsuccessfull.",
    });
    return;
  }

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

    //when email found, should return -  return {authenticatedUser: true};
    if (result.authenticatedUser) {
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
router
  .route('/protected/welcome')
  .get(async (req, res) => {
    if(req.session.email){     
      return res.render("welcomePage", {title: "Welcome", name: req.session.email});
    }
    else{
      return  res.render("forbiddenAccess", {title: "Forbidden Access" });
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
router
  .route('/protected/booking')
  .get(async (req, res) => {
    if(req.session.email){    
      return res.render("booking", {title: "Booking", name: req.session.email, cars: cars });
    }
    else{
      return  res.render("forbiddenAccess", {title: "Forbidden Access" });
    }    
  })
  .post(async (req, res) => {
    //let amountPaid = req.body.amountPaid;    
    let pickUpDate = req.body.pickUpDate;
    let pickUpTime = req.body.pickUpTime;
    let returnTime = req.body.returnTime;
    let returnDate = req.body.returnDate;
    let pickUpLocation = req.body.pickUpLocation;

    if(req.session.email){  
    
      return res.render("booking", {title: "Booking", name: req.session.email});
    }
    else{
      return  res.render("forbiddenAccess", {title: "Forbidden Access" });
    } 


  }
  );

//if booking successfull - route to payment
router.route("/payment").get(async (req, res) => {
  if (req.session.email) {
    // might have to check if booking is done successfull or not
    console.log("inside if .. emai -", req.session.email);
    res.render("paymentPage", {
      title: "Payment",
    });
    return;
  }

  res.render("userLogin", {
    title: "Enter details to login",
  });
});

router.route("/logout").get(async (req, res) => {
  //code here for GET
  req.session.destroy();
  res.render("logout", {
    title: "Logged Out",
  });
});

module.exports = router;
