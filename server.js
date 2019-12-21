const express = require("express");
//const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const path = require("path");
const Bus = require("./models/Bus");

const users = require("./routes/api/users");
const buses = require("./routes/api/buses");
// const profile = require("./routes/api/profile");
// const posts = require("./routes/api/posts");

// const shuttles = require("./routes/api/shuttles");
// const trips = require("./routes/api/shuttles");

// these are the routes that use mongoose to
// interact with the database
//const thumbnails = require("./routes/api/thumbnails");
//const mimes = require("./routes/api/mimes");
//const apitest = require("./routes/api/apitest");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(fileUpload());

// DB config

const db = require("./config/keys").mongoURI;

// Connect to Mongo

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Mongo Connected"))
  .catch(err => console.log(err));

// app.get("/", (req, res) => res.send("Hello World.  This is JJV"));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

app.use("/api/users", users);
app.use("/api/buses", buses);
// app.use("/api/profile", profile);
// app.use("/api/posts", posts);

// app.use("/api/shuttles", shuttles);
// app.use("/api/shuttles/trips", trips);

//app.use("/api/thumbnails", thumbnails);

//app.use("/api/mimes", mimes);

//app.use("/api/apitest/", apitest);

//app.use("/api/mythumbs", thumbnails);
// app.get("/api/thumbs", thumbnails);
// app.get("/api/thumbs/entertainment", thumbnails);

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

const io = socketIo(server);
let counter = 0;
let globalsocket = null;

io.sockets.on("connection", function(socket) {
  // once a client has connected, we expect to get a ping from them saying what room they want to join
  console.log("We have a socket connection wdb");
  socket.on("room", function(room) {
    //socket.set("room", room);
    console.log("joining room", room);
    socket.join(room);
  });

  socket.on("toapi", function(room, msgobj) {
    counter = counter + 1;
    console.log(
      "Received message and broadcast ",
      room,
      JSON.stringify(msgobj)
    );
    let obj = {};
    obj["msg"] = "built on server";
    obj["room"] = room;
    obj["data"] = JSON.stringify(msgobj);
    let ostr = JSON.stringify(obj);
    // io.emit("broadcast", "broadcast " + msg);
    io.sockets.in(room).emit("broadcast", ostr);
    //socket.to(room).emit("broadcast", ostr);
  });

  socket.on("leaveroom", function(room) {
    counter = counter + 1;
    console.log("Receive and broadcast ", room);
    let obj = {};
    obj["msg"] = "we are leaving rooms";
    obj["room"] = room;
    console.log("leaving room ", room);

    let ostr = JSON.stringify(obj);
    // io.emit("broadcast", "broadcast " + msg);
    socket.leave(room);
    let rms = "we have left room " + room;
    io.sockets.in(room).emit("broadcast", ostr);
  });

  socket.on("get_rooms", function() {
    var room_list = [];
    for (var room in io.sockets.adapter.rooms) {
      if (room.indexOf("/chat_infra") == 0) {
        // var roomName = room.replace("/chat_infra/", "");
        // room_list[roomName] = io.sockets.adapter.rooms[room].length;
      } else {
        //var roomName = room;
        room_list.push(room);
        //room_list.roomName = io.sockets.adapter.rooms[room].length;
      }
    }
    console.log("getting rooms ", room_list);
    socket.emit("broadcast", room_list);
  });

  socket.on("disconnect", reason =>
    console.log("Client socket disconnected WDB", reason)
  );
});

// io.on("connection", socket => {
//   globalsocket = socket;
//   console.log("New socket client connected");
//   // setInterval(() => sendTimeToClient(socket), 30000);
//   socket.emit("fromapi", "CONNECTION SUCCESS");

//   socket.on("toapi", function(msg) {
//     counter = counter + 1;
//     console.log("I received a private message by saying ", msg);
//     io.emit("broadcast", "broadcast " + msg);
//   });

//   socket.on("disconnect", reason =>
//     console.log("Client socket disconnected", reason)
//   );
// });

// Server static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.post("/restapi/bus_markers", (req, res) => {
    const errors = {};
    //let id = req.body.ownerid;
    let distance = req.body.distance;
    let lat = req.body.lat;
    let lon = req.body.lon;
    // console.log("we are in post api", id, distance, lat, lon);
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

  app.get("/restapi/bus_markers/:distance/:lat/:lon", (req, res) => {
    const errors = {};
    //let cat0 = req.params.cat;
    // let id = req.body.ownerid;
    let distance = req.params.distance;
    let lat = req.params.lat;
    let lon = req.params.lon;
    //  console.log("we are in post api", id, distance, lat, lon);
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

  app.get("/restapi/busforid/:id", (req, res) => {
    const errors = {};
    let id = req.params.id;
    let query = {
      _id: id
    };
    Bus.findOne(query)
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

  app.get("/restapi/updatebuslatlon/:id/:lat/:lon", (req, res) => {
    const errors = {};
    let id = req.params.id;
    let lat = req.params.lat;
    let lon = req.params.lon;
    const loc = { type: "Point", coordinates: [lon, lat] };
    let query = {
      _id: id
    };

    const updateobj = {
      lat: lat,
      lon: lon,
      curlat: lat,
      curlon: lon,
      location: loc
    };

    var options = { new: true };

    Bus.findOneAndUpdate(query, updateobj, options)

      .then(buses => {
        if (buses) {
          //console.log("in api", buses);
          //socket.emit("fromapi", "here is the bus lat lon" + lat + " " + lon);
          return res.json(buses);
        } else {
          errors.name = "Bus cannot be found";
          return res.status(400).json(errors);
        }
      })
      .catch(err => console.log(err));
  });

  app.get("/restapi/updatebusstatus/:id/:status/:driver", (req, res) => {
    const errors = {};
    let id = req.params.id;
    let status = req.params.status;
    let driver = req.params.driver;
    let query = {
      _id: id
    };

    const updateobj = {
      status: status,
      driver: driver
    };
    var options = { new: true };

    Bus.findOneAndUpdate(query, updateobj, options)
      .then(buses => {
        if (buses) {
          //console.log("in api", buses);
          //socket.emit("fromapi", "here is the bus lat lon" + lat + " " + lon);
          return res.json(buses);
        } else {
          errors.name = "Bus cannot be found";
          return res.status(400).json(errors);
        }
      })
      .catch(err => console.log(err));
  });

  app.get("/restapi/updatebussocket/:id/:lat/:lon", (req, res) => {
    const errors = {};
    let id = req.params.id;
    let lat = req.params.lat;
    let lon = req.params.lon;
    const loc = { type: "Point", coordinates: [lon, lat] };
    let query = {
      _id: id
    };

    const updateobj = {
      lat: lat,
      lon: lon,
      curlat: lat,
      curlon: lon,
      location: loc
    };
    console.log("we are promising to emit lat lon");
    var options = { new: true };
    return new Promise((resolve, reject) => {
      try {
        // socket.emit("fromapi", "here is the bus lat lon" + lat + " " + lon);
        resolve("DATA " + lat + " " + lon);
      } catch (e) {
        reject(e);
      }
    });
  });

  app.get("/restapi/updatebussocketemit/:id/:lat/:lon", (req, res) => {
    const errors = {};
    let id = req.params.id;
    let lat = req.params.lat;
    let lon = req.params.lon;
    console.log("we are promising to emit and return what lat lon");
    globalsocket.emit("fromapi", "here is the bus lat lon " + lat + " " + lon);
    return res.json({ now: "what" });
  });

  app.get("/restapi/buses", (req, res) => {
    Bus.find()
      .then(buses => res.json(buses))
      .catch(err => res.status(404).json({ noresults: "No Wildcards found" }));
    //API logic
  });

  //

  // need module path for this imported at top
  // so now any requests other than the ones above will go to index.html
  // find out express app.get(*)

  // any route that gets hit here in client.build will go to index.html
  app.get("*", (req, res) => {
    // go to client/build/index.html
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

//const server = app.listen(port, () =>
server.listen(port, () => console.log(`Server is running on port ${port}`));

// const io = socketIo(server);
// let counter = 0;

// io.on("connection", socket => {
//   console.log("New socket client connected"),
//     // setInterval(() => sendTimeToClient(socket), 30000);
//     socket.emit("fromapi", "we have a connection");
//   // socket.on("toapi", function(msg) {
//   //   counter = counter + 1;
//   //   console.log("I received a private message by  saying ", msg);
//   //   socket.emit("fromapi", "here is the anwer " + msg + " " + counter);
//   // });

//   socket.on("toapi", function(msg) {
//     counter = counter + 1;
//     console.log("I received a private message by  saying ", msg);
//     socket.emit("fromapi", "here is the anwer " + msg + " " + counter);
//   });

//   socket.on("disconnect", reason =>
//     console.log("Client socket disconnected", reason)
//   );
// });

const sendTimeToClient = async socket => {
  let cdate = new Date();
  let h = cdate.getHours().toString();
  let m = cdate.getMinutes().toString();
  let s = cdate.getSeconds().toString();
  if (h.length == 1) h = "0" + h;
  if (m.length == 1) m = "0" + m;
  if (s.length == 1) s = "0" + s;
  let timestr = h + ":" + m + ":" + s;
  timestr = timestr + " count:" + counter.toString();
  counter = counter + 1;
  socket.emit("fromapi", timestr);
};

//mongodb://<dbuser>:<dbpassword>@ds061188.mlab.com:61188/devconnect
