const express = require("express");
//const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const path = require("path");

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

const app = express();

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

// Server static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

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

app.listen(port, () => console.log(`Server is running on port ${port}`));

//mongodb://<dbuser>:<dbpassword>@ds061188.mlab.com:61188/devconnect
