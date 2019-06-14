const express = require("express");
const router = express.Router();
//const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load Input Validation
// const validateRegisterInput = require("../../validation/register");
// const validateLoginInput = require("../../validation/login");

const Bus = require("../../models/Bus");

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public

router.post("/register_bus", (req, res) => {
  // const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }
  const errors = {};

  Bus.findOne({ name: req.body.name }).then(bus => {
    if (bus) {
      errors.name = "Bus name already exists";
      return res.status(400).json(errors);
    } else {
      const newBus = new Bus({
        ownerid: req.body.ownerid,
        name: req.body.name,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        route: req.body.route,
        lat: req.body.lat,
        lon: req.body.lon,
        curlat: req.body.curlat,
        curlon: req.body.curlon
      });

      console.log("newBus", newBus);

      // this user is what is returned from save

      newBus
        .save()
        .then(bus => res.json(bus))
        .catch(err => console.log(err));
    }
  });
});

router.get("/find_bus/:id/:cnt", (req, res) => {
  // const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }
  const errors = {};
  let id = req.params.id;
  let cnt = req.params.cnt;
  let query = { _id: id };

  //console.log("in find bus query", query);

  Bus.findOne(query)
    .then(bus => {
      if (bus) {
        let curlat = bus.lat;
        curlat = curlat + 0.0001 * cnt;
        let curlon = bus.lon;
        curlon = curlon + 0.0001 * cnt;
        bus.lat = curlat;
        bus.lon = curlon;
        return res.json(bus);
      } else {
        errors.name = "Bus cannot be found";
        return res.status(400).json(errors);
      }
    })
    .catch(err => console.log(err));
});

// @route   GET api/users/login
// @desc    Login User / return jwt token
// @access  Public
module.exports = router;
