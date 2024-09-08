const nodemailer = require("nodemailer");
const Customer = require("../../models/customer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../../config");
const Token = require("../../models/UserToken");

const { default: UserToken } = require("../../models/UserToken");

var authController = {};

authController.login = async function (req, res) {
  const customer = await Customer.findOne({ email: req.body.email });
  //const partner = await Partner.findOne({ email: req.body.email });

  const passwordInput = req.body.password;

  if (!customer) {
    // Handle case where user is not found
    res.status(401).json({ error: "User not found" + req.body.email });
    return;
  }

  const user = customer;

  // check if the password is valid
  var passwordIsValid = await bcrypt.compare(passwordInput, user.password);

  if (!passwordIsValid)
    return res
      .status(401)
      .send({ auth: false, token: null, errorMessage: "Password Incorrect" });

  // if user is found and password is valid
  // create a token
  var token = jwt.sign({ id: user._id, role: user.role }, config.JWT_SECRET, {
    expiresIn: 86400, // expires in 24 hours
  });

  // return the information including token as JSON
  res.status(200).send({ auth: true, token: token });
};

authController.registerCustomer = async function (req, res) {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const customer = new Customer({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    contact: req.body.contact,
    address: req.body.address
  });

  try {
    await customer.save();
    // res.json(customer);
    var token = jwt.sign(
      { id: customer.id, role: customer.role },
      config.JWT_SECRET,
      {
        expiresIn: 86400,
      }
    ); // expires in 24 hours
    res.status(200).send({ auth: true, token: token });
  } catch (err) {
    return res.status(500).json(err);
  }
};

/* authController.registerPartner = function (req, res) {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.error(err);
      return res.status(400).json({ error: "Error uploading image" });
    } else if (err) {
      // Unknown error occurred
      console.error(err);
      return res.status(500).json({ error: "Unknown error uploading image" });
    }

    // File upload is successful, proceed with partner registration
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    const filename = req.file ? req.file.filename : null;

    try {
      const partner = new PartnershipRequest({
        name: req.body.name,
        email: req.body.email,
        description: req.body.description,
        dateOfRegistry: Date.now(),
        numberOfDonations: 0,
        password: hashedPassword,
        imageName: filename,
      });

      await partner.save();

      res.status(200).json(partner);
    } catch (error) {
      return res.status(500).json(error);
    }
  });
}; */

authController.verifyToken = function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers["x-access-token"];
  if (!token)
    return res.status(403).send({ auth: false, message: "No token provided." });

  // verifies secret and checks exp
  jwt.verify(token, config.secret, function (err, decoded) {
    if (err)
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });

    // if everything is good, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });
};

/* authController.verifyTokenPartner = function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers["x-access-token"];
  if (!token)
    return res.status(403).send({ auth: false, message: "No token provided." });

  // verifies secret and checks exp
  jwt.verify(token, config.JWT_SECRET, function (err, decoded) {
    if (err || decoded.role !== "PARTNER")
      return res.status(500).send({
        auth: false,
        message: "Failed to authenticate token or not Customer",
      });
    // if everything is good, save to request for use in other routes
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
}; */

authController.verifyTokenCustomer = function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers["x-access-token"];
  if (!token)
    return res.status(403).send({ auth: false, message: "No token provided." });

  // verifies secret and checks exp
  jwt.verify(token, config.JWT_SECRET, function (err, decoded) {
    if (err || decoded.role !== "DONOR")
      return res.status(500).send({
        auth: false,
        message: "Failed to authenticate token or not Customer",
      });
    // if everything is good, save to request for use in other routes
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

authController.sendEmail = async function (req, res, next) {
  const email = req.body.email; // take email from body
  if (!email || email === "") {
    res.status(400).json({ error: "No email!" });
  }
  const user = await Customer.findOne({
    email: { $regex: "^" + email + "$", $options: "i" },
  });
  if (!user) {
    res.status(400).json({ error: "User not found!" });
  }
  const payload = {
    email: user.email,
  };

  const expiryTime = 600;
  const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: expiryTime });

  const newToken = new Token({ userID: user._id, token: token });

  const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: config.USER, pass: config.PASS },
    tls: {
      rejectUnauthorized: false,
    },
  }); // email that sends the email

  let mailDetails = {
    from: "burnerandre54@gmail.com",
    to: email,
    subject: "Reset Password",
    html: ` 
    <html>
    <head>
    <title> Password Reset Request </title>
    </head>
    <body>
    <h1> Password Reset Request </h1>
    <p> Dear ${Customer.name},</p>
    <p> We received a request to reset your password to ReciclaTextil. To complete the password reset, please click on the link provided</p>
    <a href=${config.LIVE_URL}/reset/${token}> Reset Password </a>
    <p> Please note the link is only valid for 10 mins, if you didn't request a password reset please ignore this message</p>
    <p> Thank you,</p>
    <p> ReclicaTextil</p>
    </html>
      `,
  };

  mailTransporter.sendMail(mailDetails, async (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      await newToken.save();
      res
        .status(200)
        .json({ message: "lalalaaal" });
    }
  });
};

authController.resetPassword = async function (req, res, next) {
  const token = req.body.token;
  const newpassword = req.body.password;

  jwt.verify(token, config.JWT_SECRET, async (err, data) => {
    if (err) {
      res.status(400).json({ error: "Expired reset link!" });
    } else {
      const response = data;
      const user = await Customer.findOne({
        email: { $regex: "^" + response.email + "$", $options: "i" }
      });
      
      if (user) {
        const hashedPassword = await bcrypt.hash(newpassword, 10);
      
        // Update the user's password field directly
        try {
          const updateUser = await Customer.findOneAndUpdate(
            { _id: user._id }, // Use _id which is the default unique identifier
            { $set: { password: hashedPassword } }, // Only update the password
            { new: true } // Return the updated document
          );
        res.status(200).json({updateUser, message : "success"});
      } catch (error) {
        res.status(500).json({ error: "failure" });
      }
    }
  };
});
}

module.exports = authController;