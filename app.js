const express = require("express");
const app = express();
const static = express.static(__dirname + "/public");
const session = require("express-session");
const nodemailer = require("nodemailer");
//const detail = require('./public/js/clientValidation')

const configRoutes = require("./routes");
const exphbs = require("express-handlebars");
app.use(express.static("../public/images"));

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

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
//app.use(express.static("images"));
//forbid the user to go to any route if not authenticated
// app.use('/protected', (req,res,next) => {
//     if(!req.session.email) {
//         res.status(403).render('forbiddenAccess', {
//             title: "Forbidden"
//         })
//     }else{
//         next();
//     }
// })
app.use('/protected/welcome', (req, res, next) => {
  //console.log(req.session.id);
  if (!req.session.email) {
      return res.status(403).render("forbiddenAccess", {title: "Not logged in" });
  } else {
      next();
  }
});
app.use('/login', (req, res, next) => {
  if (req.session.email) {
    return res.redirect('/protected/welcome');
  } else {
    //here I',m just manually setting the req.method to post since it's usually coming from a form
    req.method = 'POST';
    next();
  }
});

//app.get("/protected/successBooking", (req, res) => {
// cars=[];
 //cars.push({ src: "../../public/images/suv.jpg", name: "Suv" });
 //cars.push({ src: "../../public/images/sedan.jpg", name: "Sedan" });
 //cars.push({ src: "../../public/images/bmw.jpg", name: "Bmv" });
//});

app.use((req, res, next) => {
  console.log("Current Timestamp: ", new Date().toUTCString());
  console.log("Request Method: ", req.method);
  console.log("Request Route: ", req.originalUrl);
  console.log(`${req.session.email ? "Authenticated" : "Not-Authenticated"}`);

  next();
});

app.post("/send", (req, res) => {
 //console.log("inside app.js .. /send..", req.body);
 //console.log("inside app.js .. /send. session.", req.session);


  const output = `
    <p>You have  a new email</p>
    <p>Thank you for using DriveNow Car Rental. </p>
    <p>To check your booking or update the booking, login into DriveNow web application.</p>
    </ul>
    `;

    // This is taken from - https://nodemailer.com/about/
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

    return res.render("userLogin", {
      msg: `Email has been sent to : ${toEmail} for further communication.`,
    });
  });
});


app.post("/protected/send", (req, res) => {
  // console.log("inside app.js .. /send..", req.body);
  //console.log("inside app.js .. /send. session.", req.session);
 
 
   const output = `
     <p>You have  a new email</p>
     <p>Thank you for using DriveNow Car Rental. </p>
     <p>To check your booking or update the booking, login into DriveNow web application.</p>
     </ul>
     `;
 
     // This is taken from - https://nodemailer.com/about/
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
 
     res.render("welcomePage", {
      success: `Email has been sent to : ${toEmail} for further communication And Booking is made.`,
     });
   });
 });

configRoutes(app);

app.listen(3000, () => {
  console.log("Server has been initialized!");
  console.log("Your routes will be running on http://localhost:3000");
});
