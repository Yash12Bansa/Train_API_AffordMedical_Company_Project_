const express = require("express");

const router = express.Router();
const { query, validationResult } = require("express-validator");

const Company = require("../models/Company");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchcompany = require("../middleware/fetchcompany");

const JWT_SECRET = "yash@123bansal1234";

//Route1: Create a company
router.post(
  "/register",
  [
    query("companyname"),
    query("ownername"),
    query("rollno"),
    query("owneremail", query("accesscode")),
  ],
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.send({ errors: result.array() });
    }
    try {
      //check whether the user with this comapy name exists
      let company = await Company.findOne({
        owneremail: req.body.owneremail,
      });
      if (company) {
        return res
          .status(400)
          .json({ error: "Soory a company with this email already exixts " });
      }
      const salt = await bcrypt.genSalt(10);

      const clientsecret = await bcrypt.hash(req.body.accesscode, salt);

      //create a new user
      company = await Company.create({
        companyname: req.body.companyname,
        ownername: req.body.ownername,
        rollno: req.body.rollno,
        owneremail: req.body.owneremail,
        accesscode: clientsecret,
      });
      const data = {
        comapny: {
          id: company._id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({
        companyname: company.companyname,
        clientId: company._id,
        clientSecret: company.accesscode,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("some error occured");
    }
  }
);

//Route2: Authenticate a company

router.post(
  "/auth",
  [
    query("companyname"),
    query("ownername"),
    query("rollno"),
    query("owneremail"),
    query("accesscode"),
  ],
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.send({ errors: result.array() });
    }
    const { companyname, ownername, rollno, owneremail, accesscode } = req.body;
    try {
      let company = await Company.findOne({ owneremail: owneremail });
      if (!company) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }
      const passcompare = await bcrypt.compare(accesscode, company.accesscode);
      if (!passcompare) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }
      const data = {
        company: {
          id: company._id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      function decodetoken(authtoken) {
        try {
          const decoded = jwt.decode(authtoken);
          return decoded;
        } catch (error) {
          console.log("Error decoding JWT:", error.message);
          return null;
        }
      }
      const decodedToken = decodetoken(authtoken);
      if (decodedToken) {
        const tokenType = decodedToken.typ;
        const expirationTime = decodedToken.exp;
        res.json({
          "token-type": "Bearer",
          "auth-token": authtoken,
          "expires-in": Math.floor(Date.now() / 1000) + 3600,
        });
      } else {
        console.log("Invalid JWT.");
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).send("some error occured");
    }
  }
);

//Route 3:get train details login required
router.get(
  "/trains",
  fetchcompany,

  async (req, res) => {
    try {
      const companyid = req.company.id;
      const company = await Company.findById(companyid).select("-clientsecret");
      res.send(company);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("some error occured");
    }
  }
);

module.exports = router;
