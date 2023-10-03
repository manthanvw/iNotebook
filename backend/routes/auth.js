const express = require("express"); //Importing express.js
const User = require("../models/User"); // Importing User template from models/User
const { body, validationResult } = require("express-validator"); //Using express validator to identify a bad request like user already exists
const router = express.Router(); //Using express router to post data to server
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchUser")

const JWT_SECRET = "Manthanisagood$boy";

// Create a user using: POST "/api/auth/createuser". No login required (Signup)

// ROUTE 1: Taking input in Thunder client. All inputs must be given else missing is flagged using express Validator
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }), // body(error message,setting other properties)
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast five characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // If there are error return Bad request and the error
    let success= false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // Check whether user email already exists
      let user = await User.findOne({ email: req.body.email });
      // console.log(user)
      if (user) {
        return res.status(400).json({ error: "User email already exists" });
      }
      const salt = await bcrypt.genSalt(10); //It returns a promise therefore await
      const securedPass = await bcrypt.hash(req.body.password, salt);

      // Creating user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securedPass,
      });
      // Displaying user in thunder cloud
      const data = {
        user: {
          id: user.id,
        },
      };

      // const jwtData = jwt.sign(data,JWT_SECRET);
      // console.log(jwtData)

      const authtoken = jwt.sign(data, JWT_SECRET);
      success=true
      res.json({ success,authtoken });
      // res.json(user);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
// ROUTE 2: Authenticate a user using: POST "api/auth/login" No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let  success=false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      
      return res.status(400).json({success, errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
      
        return res
          .status(400)
          .json({success, error: "Please try to login with correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
  
        return res
          .status(400)
          .json({success, error: "Please try to login with correct credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({success, authtoken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//  ROUTE 3: Get loggedin user details using POST: "api/auth/getuser". Login required
router.post(
  "/getuser", fetchUser ,async (req, res) => {

    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user)
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
module.exports = router; //Exporting the function router

// ---------------------METHOD -2 --------------------
// Create a user using: POST "/api/auth/". Doesn't require auth
// router.post('/',[
//     body('name','Enter a valid name').isLength({ min: 3 }),
//     body('email','Enter a valid email').isEmail(),
//     body('password','Password must be atleast five characters').isLength({ min: 5 }),
//     ],
//     (req,res)=>{
//       // If there are error return Bad request and the error
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//         }
//          User.create({
//             name: req.body.name,
//             email: req.body.email,
//             password: req.body.password,
//           })
//           .then(user => res.json(user))
//           .catch(err=> {
//             console.log(err)
//               res.json({error:"Please enter a unique email",message:err.message})}
//             )
//         })

// module.exports = router

// -----------------------METHOD-3----------------------------
// const express = require('express')
// const User = require('../models/User')
// const { body, validationResult } = require('express-validator');
// const router = express.Router()

// // Create a user using: POST "/api/auth/". Doesn't require auth

// router.post('/',[
//     body('name','Enter a valid name').isLength({ min: 3 }),
//     body('email','Enter a valid email').isEmail(),
//     body('password','Password must be atleast five characters').isLength({ min: 5 }),
//     ],
//     (req,res)=>{
//       // If there are error return Bad request and the error
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//         }

//         console.log(req.body);
//         const user = User(req.body);
//         user.save()
//       })

// module.exports = router
