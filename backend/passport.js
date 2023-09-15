const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const db = require("./lib/db");

const GOOGLE_CLIENT_ID = "568362901125-jmo8j3bi398rrab6o6hca200qp5nl1n8.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope : ["profile","email"],
    },
    function (accessToken, refreshToken, profile, done) {

      console.log(profile)
      const email = profile._json.email;
      const domain = email.split("@")[1];

      // stclab.com 사용자만 로그인 
      if (domain === "stclab.com") {
        done(null, profile);
      }
      else {
        done(null, false, { message: "Invalid email domain" });
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  const username = user._json.family_name;
  const uid = user._json.email.split("@")[0];
  console.log("user : ", username);
  console.log("email : ",user._json.email);
  console.log("user id : ", uid);

  // db.query(`SELECT * FROM users`, (err,rows) => {
  //   console.log(rows)
  // });

  db.query(
    `SELECT * FROM users WHERE emailuid = ?`, [uid],(err, rows) => {
      if (err) {
        console.log("SELECT 중 오류 발생:", err);
        done(err);
      } else {
          if (rows === [] || rows.length === 0) {
          // 해당 uid가 존재하지 않을 때에만 INSERT 수행
            
          try {
          db.query("INSERT INTO users (emailuid, username, privilege) VALUES (?, ?, ?)", [uid, username, "viewer"],(err, result) => {
            if (err) { console.log("INSERT 중 오류 발생:", err);} 
            else { console.log("db 추가 완료"); }
          });
        }catch(error){
          console.error("error during db.query")
        }
          }
          else {
            console.log("이미 존재하는 uid");
            done(null, user);
          }
      }
    });
  });
