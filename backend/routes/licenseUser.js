const router = require("express").Router();
const passport = require("passport");

const db = require("../lib/db");

// /api/selectPrivilege
router.post("/api/selectPrivilege", (req, res) => {
  // 데이터베이스 조회
  const sql = "SELECT privilege FROM users WHERE emailuid=? and deleteYN = 1";

  db.query(sql, [req.body.emailuid] ,(selectErr, selectResult) => {

    console.log("emailuid : ",req.body.emailuid)

    if(selectErr) console.log("select users privilege Error : ", selectErr);
    else{
       console.log("select users privilege success!");
       console.log("privilege :", selectResult);
       res.json(selectResult); // 조회 결과를 JSON 형식으로 반환
      }
  })

});

// /api/selectUser POST 요청 처리
router.get("/api/selectUser", (req, res) => {
  // 데이터베이스 조회
  const sql = "SELECT * FROM users WHERE deleteYN=1";
  db.query(sql, (selectErr, selectResult) => {
    if(selectErr) console.log("select users Error : ", selectErr);
    else{
       console.log("select users success!");
       res.json(selectResult); // 조회 결과를 JSON 형식으로 반환
      }
  })
});

// /api/selectUserID GET 요청 처리
router.get("/api/selectUser/:id", (req, res) => {

  const {id} = req.params;

  // 데이터베이스 조회
  const sql = "SELECT * FROM users WHERE id=? AND deleteYN=1";
  db.query(sql, [id], (selectErr, selectResult) => {
    if(selectErr) console.log("select users id Error : ", selectErr);
    else{
       console.log("select users id success!");
       res.json(selectResult); // 조회 결과를 JSON 형식으로 반환
      }
  })
});



// /api/EditLicense GET 요청 처리
router.post("/api/editUser/", (req, res) => {
  console.log("edit",req.body);
  const emailuid = req.body.emailuid;
  const privilege = req.body.privilege;

   // 데이터베이스 UPDATE : 해당 row의 user privilege UPDATE
   const updateSql = "UPDATE users SET privilege = ? WHERE emailuid = ? and deleteYN = 1";
   db.query(updateSql, [privilege,emailuid], (updateErr, updateResult) => {
    if(updateErr) {console.log("update users privilege Error :",updateErr)}
    else { console.log("update users privilege success!");
    res.json({ success: true });
   }
   })
  
 
});

// /api/deleteUser POST 요청 처리
router.delete("/api/deleteUser/:id", (req, res) => {
  const {id} = req.params;
  console.log("delete : ",id)

  // 데이터베이스 UPDATE : 해당 row의 users 테이블 deleteYN 컬럼을 0으로 UPDATE
  const updateSql = "UPDATE users SET deleteYN = 0 WHERE id = ?";
  db.query(updateSql, [id], (updateErr, updateResult) => {
    if (updateErr) { console.log("update users deleteYN Error : ", updateErr) } 
    else { console.log("update users deleteYN success!"); }
  });

    // 데이터베이스 INSERT : 해당 row의 licenseHistory INSERT
    const insertSql = "INSERT INTO license.licensehistory (lid,uid,action,gendate,regtime,producttype,orgcode,expdate,segment,maxccu,execount,domain,companyname,licensekey) \
    SELECT id, uid, 'DELETE', gendate, DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s') as regtime, producttype, orgcode, expdate, segment, maxccu, execount, domain, companyname, licensekey FROM license WHERE uid = ? AND deleteYN=1";
    
    db.query(insertSql, [id], (insertErr, insertResult) => {
      if (insertErr) { console.log("insert licensehistory user DELETE Error : ", insertErr) } 
      else { console.log("insert licensehistory user DELETE success!"); }
    });

  // 데이터베이스 UPDATE : 해당 row의 license 테이블 deleteYN 컬럼을 0으로 UPDATE
  const licenseupdateSql = "UPDATE license SET deleteYN = 0 WHERE uid = (SELECT id FROM users WHERE id=?)";
  db.query(licenseupdateSql, [id], (updateErr, updateResult) => {
    if (updateErr) { console.log("select users & update license deleteYN Error : ", updateErr) } 
    else { console.log("select users & update license deleteYN success!"); }
  });

});



module.exports = router