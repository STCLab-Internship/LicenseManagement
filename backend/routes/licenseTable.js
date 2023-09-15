const router = require("express").Router();
const passport = require("passport");
const axios = require("axios");
const db = require("../lib/db");

// license key 발급 api 전달 date format
function formatDateToYYMMDD(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear().toString().slice(-2).padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return year + month + day;
}

// /api/addLicense GET 요청 처리
router.post("/api/addLicense/", (req, res) => {
  console.log("add",req.body);

  // API 엔드포인트에 맞춰서 파라미터 생성
  const params = new URLSearchParams();
  params.append("genDate", formatDateToYYMMDD(req.body.gendate));
  params.append("productType", req.body.producttype);
  params.append("orgCode", req.body.orgcode);
  params.append("expDate", formatDateToYYMMDD(req.body.expdate));
  params.append("numOfSegment", req.body.segment);
  params.append("maxCCU", req.body.maxccu);
  params.append("excCountLimit", req.body.execount);
  params.append("domain", req.body.domain);

  console.log("params", params);
  // API 호출
  const apiUrl = `http://192.168.20.85:61011/surffy_license.jsp?${params}`;
  axios
    .get(apiUrl)
    .then((response) => {
      console.log("API 응답:", response.data);

      // licensekey응답 올바르게 왔으면 insert 처리
      const insertQuery = `
      INSERT INTO license (gendate,regtime,producttype,orgcode, expdate, segment, maxccu, execount, domain, companyname, licensekey)
      VALUES ( ?,?,?,?,?,?,?,?,?,?,?)`;
  
      const expDate = new Date(req.body.expdate).toISOString().slice(0, 19).replace('T', ' ');
      const regTime = new Date(req.body.regtime).toISOString().slice(0, 19).replace('T', ' ');
      const genDate = new Date(req.body.gendate).toISOString().slice(0, 19).replace('T', ' ');
  
    // 쿼리 실행
    db.query(insertQuery, [genDate, regTime, req.body.producttype, req.body.orgcode, expDate, req.body.segment, req.body.maxccu, 
                          req.body.execount, req.body.domain, req.body.companyname, response.data.license_key], (err, result) => 
    {
      if (err) {
        console.log("DB INSERT 에러:", err);
        res.status(500).json({ error: "데이터베이스 INSERT 중 에러 발생" });
      } else {
        console.log("DB INSERT 성공");

       // INSERT 성공 시, UPDATE uid
       const getUidQuery = `SELECT id FROM users WHERE emailuid = ? and deleteYN=1`;
  
       // 쿼리 실행 - SELECT
       db.query(getUidQuery, [req.body.emailuid], (err, rows) => {
         if (err) {
           console.log("DB user id SELECT 에러:", err);
           res.status(500).json({ error: "DB user id SELECT 중 에러 발생" });
         } else {
           // rows 배열에서 id 값을 가져옵니다.
           const uid = rows[0].id;
  
           // license 테이블의 uid 컬럼을 업데이트하는 쿼리를 작성합니다.
           const updateQuery = `UPDATE license SET uid = ? WHERE domain = ?`;
  
           // 쿼리 실행 - UPDATE
           db.query(updateQuery, [uid, req.body.domain], (err, result) => {
             if (err) {
               console.log("DB uid UPDATE 에러:", err);
               res.status(500).json({ error: "DB UPDATE 중 에러 발생" });
             } else {
               console.log("DB uid UPDATE 성공");

                 // license DB INSERT 성공 시, license history DB INSERT
                const inserthistoryQuery = "INSERT INTO license.licensehistory (lid,uid,action,gendate,regtime,producttype,orgcode,expdate,segment,maxccu,execount,domain,companyname,licensekey) \
                SELECT id, uid, 'ADD', gendate, DATE_FORMAT(regtime, '%Y-%m-%d %H:%i:%s') as regtime, producttype, orgcode, expdate, segment, maxccu, execount, domain, companyname, licensekey \
                FROM license WHERE domain = ?";
                db.query(inserthistoryQuery, [req.body.domain], (insertErr, insertResult) => {
                  if (insertErr) { console.log("insert licensehistory ADD Error : ", insertErr) } 
                  else { console.log("insert licensehistory ADD success!"); }
                });
               res.json({ success: true });
             }
           });
         }
       });
     }
   });
});
});


// /api/EditLicense GET 요청 처리
router.post("/api/editLicense/", (req, res) => {
  console.log("add",req.body);

  // API 엔드포인트에 맞춰서 파라미터 생성
  const params = new URLSearchParams();
  params.append("genDate", formatDateToYYMMDD(req.body.gendate));
  params.append("productType", req.body.producttype);
  params.append("orgCode", req.body.orgcode);
  params.append("expDate", formatDateToYYMMDD(req.body.expdate));
  params.append("numOfSegment", req.body.segment);
  params.append("maxCCU", req.body.maxccu);
  params.append("excCountLimit", req.body.execount);
  params.append("domain", req.body.domain);

  console.log("params", params);
  // API 호출
  const apiUrl = `http://192.168.20.85:61011/surffy_license.jsp?${params}`;
  axios
    .get(apiUrl)
    .then((response) => {
      console.log("API 응답:", response.data);

      // licensekey응답 올바르게 왔으면 insert 처리
      const updateQuery = `
      UPDATE license \
      SET gendate=?, regtime=? ,producttype=? ,orgcode=? , expdate=? , segment=? , maxccu=? , execount=? , domain=? , companyname=? , licensekey=? \
      WHERE id = ?`;
  
      const expDate = new Date(req.body.expdate).toISOString().slice(0, 19).replace('T', ' ');
      const regTime = new Date(req.body.regtime).toISOString().slice(0, 19).replace('T', ' ');
      const genDate = new Date(req.body.gendate).toISOString().slice(0, 19).replace('T', ' ');
  
    // 쿼리 실행
    db.query(updateQuery, [genDate, regTime, req.body.producttype, req.body.orgcode, expDate, req.body.segment, req.body.maxccu, 
                          req.body.execount, req.body.domain, req.body.companyname, response.data.license_key, req.body.id], (err, result) => 
    {
      if (err) {
        console.log("DB UPDATE 에러:", err);
        res.status(500).json({ error: "데이터베이스 UPDATE 중 에러 발생" });
      } else {
        console.log("DB UPDATE 성공");

        // license DB UPDATE 성공 시, license history DB INSERT
        const inserthistoryQuery = "INSERT INTO license.licensehistory (lid,uid,action,gendate,regtime,producttype,orgcode,expdate,segment,maxccu,execount,domain,companyname,licensekey) \
        SELECT id, uid, 'EDIT', gendate, DATE_FORMAT(regtime, '%Y-%m-%d') as regtime, producttype, orgcode, expdate, segment, maxccu, execount, domain, companyname, licensekey \
        FROM license WHERE domain = ?";
        
        db.query(inserthistoryQuery, [req.body.domain], (insertErr, insertResult) => {
          if (insertErr) { console.log("insert licensehistory EDIT Error : ", insertErr) } 
          else { console.log("insert licensehistory EDIT success!"); }
        });
        res.json({ success: true });
      }
    });
  });
});


// /api/selectLicense GET 요청 처리
router.get("/api/selectLicense", (req, res) => {
   // 데이터베이스 조회
   // DATE_FORMAT 함수를 사용하여 gendate 필드를 "yyyy-mm-dd" 형식 변환
   const sql = "SELECT license.id, license.uid, username, DATE_FORMAT(regtime, '%Y-%m-%d') as regtime,  DATE_FORMAT(gendate, '%Y-%m-%d') as gendate, \
                       producttype, orgcode, DATE_FORMAT(expdate, '%Y-%m-%d') as expdate, segment, maxccu, execount, domain, companyname, licensekey\
                FROM license JOIN users ON license.uid=users.id \
                WHERE license.deleteYN=1;"
  
                db.query(sql, (selectErr, selectResult) => {
    if(selectErr) console.log("select license Error : ", selectErr);
    else{
       console.log("select license success!");
       res.json(selectResult); // 조회 결과를 JSON 형식으로 반환
      }
  })
});

// /api/selectLicenseID GET 요청 처리
router.get("/api/selectLicense/:id", (req, res) => {
    const {id} = req.params;

    // 데이터베이스 조회
    const sql = "SELECT license.id, uid, DATE_FORMAT(regtime, '%Y-%m-%d') as regtime,  DATE_FORMAT(gendate, '%Y-%m-%d') as gendate, \
                producttype, orgcode, DATE_FORMAT(expdate, '%Y-%m-%d') as expdate, segment, maxccu, execount, domain, companyname, licensekey\
                FROM license JOIN users ON license.uid=users.id \
                WHERE id=?";
      db.query(sql, [id], (selectErr, selectResult) => {
      if(selectErr) console.log("select license id Error : ", selectErr);
      else{
         console.log("select license id success!");
         res.json(selectResult); // 조회 결과를 JSON 형식으로 반환
        }
    })
  });

// /api/deleteLicense DELETE 요청 처리
router.delete("/api/deleteLicense/:id", (req, res) => {
  const {id} = req.params;
  console.log("delete 처리 + history기록 : ",id)

   // 데이터베이스 INSERT : 해당 row의 licenseHistory INSERT
   const insertSql = "INSERT INTO licensehistory (lid,uid,action,gendate,regtime,producttype,orgcode,expdate,segment,maxccu,execount,domain,companyname,licensekey) \
                      SELECT id, uid, 'DELETE', gendate, DATE_FORMAT(NOW(), '%Y-%m-%d') as regtime, producttype, orgcode, expdate, segment, maxccu, execount, domain, companyname, licensekey \
                      FROM license WHERE id = ?";
   db.query(insertSql, [id], (insertErr, insertResult) => {
     if (insertErr) { console.log("insert licensehistory DELETE Error : ", insertErr) } 
     else { console.log("insert licensehistory DELETE success!"); }
   });

  // 데이터베이스 UPDATE : 해당 row의 deleteYN 컬럼을 0으로 UPDATE
  const updateSql = "UPDATE license SET deleteYN = 0 WHERE id = ?";
  db.query(updateSql, [id], (updateErr, updateResult) => {
    if (updateErr) { console.log("update license deleteYN Error : ", updateErr) } 
    else { console.log("update license deleteYN success!"); }
  });
});

module.exports = router