const express = require("express");
const app = express();
const static = express.static(__dirname + "/public");
const session = require("express-session");
const nodemailer = require("nodemailer");
//const detail = require('./public/js/clientValidation')

const configRoutes = require("./routes");
const exphbs = require("express-handlebars");

app.use("/public", static);
app.use(express.json());

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use((req, res, next) => {
  console.log("Current Timestamp: ", new Date().toUTCString());
  console.log("Request Method: ", req.method);
  console.log("Request Route: ", req.originalUrl);
  console.log(`${req.session.email ? "Authenticated" : "Not-Authenticated"}`);

  next();
});

app.post("/send", (req, res) => {
 console.log("inside app.js .. send..", req.body);

  const output = `
    <p>You have  a new email</p>
    <h3>Email details:</h3>
    <ul>
    <li>Name: </li>
    <h3>Msg</h3>
    <p>This has to be set later on</p>
    </ul>
    `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "webProgramming546@gmail.com", // admin mail id to send confimraion booking
      pass: "bveggegzdnaiucxt", // password - Test1234567*
      // Will need to change the 2 step verification number ????
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  let toEmail = req.body.email;
  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Test Web 546" <webProgramming546@gmail.com>', // sender address
    //to: "parumahajan24@gmail.com", // list of receivers {{req.session.email}}
    to: toEmail, // list of receivers {{req.session.email}}
    subject: "Node test Request", // Subject line
    text: "Hello world?", // plain text body
    html: output, // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.render("userLogin", {
      msg: `Email has been sent to : ${toEmail} for further communication.`,
    });
  });
});

configRoutes(app);

app.listen(3000, () => {
  console.log("Server has been initialized!");
  console.log("Your routes will be running on http://localhost:3000");
});
