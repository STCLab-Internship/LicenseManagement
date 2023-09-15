const router = require("express").Router();
const passport = require("passport");

// const CLIENT_URL = "http://clover.stclab.com:8006/";
const CLIENT_URL = "http://localhost:8006/"

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
    });
    return;
  }

  res.status(400).json({
    success: false,
    message: req.body
  });
  
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(CLIENT_URL);
});

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: CLIENT_URL+"main",
    failureRedirect: CLIENT_URL,
  })
);

module.exports = router