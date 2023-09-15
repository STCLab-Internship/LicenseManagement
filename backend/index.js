const cookieSession = require("cookie-session");
const express = require("express");

const cors = require("cors");
const bodyParser = require("body-parser");
const passportSetup = require("./passport");
const passport = require("passport");
const authRoute = require("./routes/auth");
const licenseUserRoute = require('./routes/licenseUser');
const licenseRoute = require('./routes/licenseTable');
const licenseHistoryRoute = require('./routes/licenseHistory');
const pwdRoute = require('./routes/pwd');
const app = express();

app.use(
  cookieSession({ name: "session", keys: ["googlelogin"], maxAge: 24 * 60 * 60 * 100 })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: ["http://clover.stclab.com:8006", "http://localhost:8006"],
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  })
);

app.use("/auth", authRoute);
app.use("/licenseUser", licenseUserRoute);
app.use("/licenseTable", licenseRoute);
app.use("/licenseHistory", licenseHistoryRoute);
app.use("/pwd", pwdRoute);

// app.use(express.static('../client/build')); 

app.listen("8005", () => {
  console.log("Server is running!");
});
