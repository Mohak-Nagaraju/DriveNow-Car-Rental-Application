const express = require("express");
const router = express.Router();
let userData = require("../data/users");

//root route - login/registration page
router.route("/").get(async (req, res) => {
  if (req.session.email) {
    //console.log("inside / get..", req.session.email);
    res.redirect("/welcome");
    return;
  }
  res.render("userLogin", {
    title: "Enter details to login",
  });
});

router
  .route("/register")
  .get(async (req, res) => {
    if (req.session.email) {
      res.redirect("/welcome");
      return;
    }
    res.render("userRegister", {
      title: "SignUp",
    });
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
      // console.log("inside register post method...", usernameInput);
      res.status(400).render("userRegister", {
        title: "SignUp",
        error: "All fields must have valid input",
      });
      return;
    }
    //email validation
    if (typeof email !== "string") {
      res.status(400).render("userRegister", {
        title: "SignUp",
        error: "Invalid email.",
      });
      return;
    }
    //password validation
    if (typeof hashPassword !== "string" || hashPassword.trim().length < 8) {
      res.status(400).render("userRegister", {
        title: "SignUp",
        error: "Enter a valid password",
      });
      return;
    }

    //firstName validation
    if (typeof firstName !== "string" || firstName.trim().length < 0) {
      res.status(400).render("userRegister", {
        title: "SignUp",
        error: "Enter a valid first name",
      });
      return;
    }

    //lastName validation
    if (typeof lastName !== "string" || lastName.trim().length < 0) {
      res.status(400).render("userRegister", {
        title: "SignUp",
        error: "Enter a valid last name",
      });
      return;
    }

    // console.log("age..,", typeof age)
    //age validation
    if (typeof age !== "string" || age < 1 || age > 100 || age == "") {
      res.status(400).render("userRegister", {
        title: "SignUp",
        error: "Enter a valid age",
      });
      return;
    }

    if (
      typeof lincenceNumber !== "string" ||
      lincenceNumber.trim().length < 15
    ) {
      res.status(400).render("userRegister", {
        title: "SignUp",
        error: "Enter a valid lincence number",
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
        res.status(500).json({ error: "Internal Server Error" });
      }
    } catch (error) {
      res.status(500).render("userRegister", {
        title: "SignUp",
        error: error.message ? error.message : error,
      });
    }
  });

router.route("/login").post(async (req, res) => {
  const { email, hashPassword } = req.body;
  if (!email || !hashPassword) {
    res.status(400).render("userLogin", {
      title: "Enter details to login",
      error: "Please enter email and password",
    });
    return;
  }
  //not sure if we need this validation for email
  if (typeof email !== "string") {
    res.status(400).render("userLogin", {
      title: "Enter details to login",
      error: "Invalid email.",
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
      res.status(200).redirect("/welcomePage");
      return;
    }
  } catch (error) {
    res.status(500).render("userLogin", {
      title: "Enter details to login",
      error: error.message ? error.message : error,
    });
  }
});

router.route("/welcome").get(async (req, res) => {
  //console.log("email in welcome page..", req.session.email);
  res.render("welcomePage", {
    title: "Welcome",
    name: req.session.email,
    //Poorvi's code should go here
  });
});

router.route("/logout").get(async (req, res) => {
  //code here for GET
  req.session.destroy();
  res.render("logout", {
    title: "Logout",
  });
});

module.exports = router;
