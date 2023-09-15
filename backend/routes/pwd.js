const router = require("express").Router();
const bcrypt = require('bcrypt');
const db= require("../lib/db");

router.post('/api/verifyPassword', (req,res) => {
    const { password } = req.body;
    console.log("입력한pwd :",password)

    // 데이터베이스 조회
  const sql = "SELECT * FROM pwd";
  db.query(sql, (Err, Result) => {
    if(Err) console.log("select pwd id Error : ", Err);
    else{
       console.log("select pwd success!");

       bcrypt.compare(password, Result[0]['password'], (err, result) => {
        if (err) {
            console.error('비밀번호 인증 오류:', err);
            res.json({ success: false });
          } else {
            if (result) {
              console.log('비밀번호 인증 성공!');
              res.json({ success: true });
            } else {
              console.log('비밀번호 인증 실패');
              res.json({ success: false });
            }
          }
      });  
    
    }
  })
})

module.exports = router