const router = require("express").Router();
const db = require("../lib/db");

// /api/selectLicense GET 요청 처리
router.get("/api/selectLicenseHistory", (req, res) => {
   // 데이터베이스 조회

   const sql = "SELECT licensehistory.id, username, licensehistory.action, DATE_FORMAT(regtime, '%Y-%m-%d') as regtime,  DATE_FORMAT(gendate, '%Y-%m-%d') as gendate, \
                producttype, orgcode, DATE_FORMAT(expdate, '%Y-%m-%d') as expdate, segment, maxccu, execount, domain, companyname, licensekey\
                FROM licensehistory JOIN users ON licensehistory.uid=users.id;"

  db.query(sql, (selectErr, selectResult) => {
    if(selectErr) console.log("select licensehistory Error : ", selectErr);
    else{
       console.log("select licensehistory success!");
       res.json(selectResult); // 조회 결과를 JSON 형식으로 반환
      }
  })
});

module.exports = router