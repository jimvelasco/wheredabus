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
      const loc = { type: "Point", coordinates: [req.body.lon, req.body.lat] };
      const newBus = new Bus({
        ownerid: req.body.ownerid,
        name: req.body.name,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        route: req.body.route,
        lat: req.body.lat,
        lon: req.body.lon,
        curlat: req.body.curlat,
        curlon: req.body.curlon,
        location: loc
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

router.get("/bus_markers/:id", (req, res) => {
  const errors = {};
  let id = req.params.id;
  //let cnt = req.params.cnt;
  let query = { ownerid: id };
  Bus.find(query)
    .then(buses => {
      if (buses) {
        console.log("in api", buses);
        return res.json(buses);
      } else {
        errors.name = "Bus cannot be found";
        return res.status(400).json(errors);
      }
    })
    .catch(err => console.log(err));
});

router.post("/zzbus_markers", (req, res) => {
  const errors = {};
  let id = req.body.ownerid;
  //let id = req.params.id;
  //let cnt = req.params.cnt;
  let query = { ownerid: id };
  Bus.find(query)
    .then(buses => {
      if (buses) {
        console.log("in api", buses);
        return res.json(buses);
      } else {
        errors.name = "Bus cannot be found";
        return res.status(400).json(errors);
      }
    })
    .catch(err => console.log(err));
});

router.post("/bus_markers", (req, res) => {
  const errors = {};
  let id = req.body.ownerid;
  let distance = req.body.distance;
  // let coords = req.body.coordinates;
  // let lat = coords[1];
  // let lon = coords[0];

  let lat = req.body.lat;
  let lon = req.body.lon;

  console.log("we are in post api", id, distance, lat, lon);

  //let id = req.params.id;
  //let cnt = req.params.cnt;
  //gondola 40.457226 -106805936
  // let query = { ownerid: id };
  // lat = 40.457226;
  // lon = -106.805936;

  let query = {
    location: {
      $near: {
        $maxDistance: distance,
        $geometry: { type: "Point", coordinates: [lon, lat] }
      }
    }
  };

  Bus.find(query)
    .then(buses => {
      if (buses) {
        //console.log("in api", buses);
        return res.json(buses);
      } else {
        errors.name = "Bus cannot be found";
        return res.status(400).json(errors);
      }
    })
    .catch(err => console.log(err));
});

// Message.find({
//   location: {
//     $near: {
//       $maxDistance: 1000,
//       $geometry: {
//         type: "Point",
//         coordinates: [long, latt]
//       }
//     }
//   }
// }).find((error, results) => {
//   if (error) console.log(error);
//   console.log(JSON.stringify(results, 0, 2));
// });

// @route   GET api/users/login
// @desc    Login User / return jwt token
// @access  Public
module.exports = router;
