import React, {useState, useEffect} from "react";
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import './LicenseEditModal.css';
import Alert from '@mui/material/Alert';

const style = {
    position: 'absolute',
    top: '50%',
    left: '60%',
    transform: 'translate(-50%, -50%)',
    width: 750,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  

function LicenseEditModal({editopen, setEditOpen, licenseData}){

    const [license, setLicense] = useState({ ...licenseData });
    const [editalert, setEditAlert] = useState({
      success : false,
      fail : false
    })

     function getLicense() {
        fetch(`${process.env.REACT_APP_SERVER_URL}/licenseTable/api/selectLicense`)
        .then(response => response.json())
        .then(data => {
          setLicense(data);
        })
        .catch(error => {
          console.log("Error fetching users:", error);
        });
    }

    const handleClose = () => setEditOpen(false);
    const handleEdit = () => {
      const currentTime = new Date().toLocaleDateString('en-CA'); // 'yyyy-mm-dd' 형식으로 날짜를 포맷팅

       // license.gendate가 ""인 경우 현재 시간으로 업데이트
       if (license.gendate === "") {
        setLicense((prevLicense) => ({
          ...prevLicense,
          gendate: currentTime.toString(),
          regtime : currentTime.toString()
      }));
      }
      else {
        setLicense((prevLicense) => ({
        ...prevLicense,
        regtime: currentTime.toString(),
      }));
      }
    }
    
    useEffect(()=>{
      if (licenseData) {
        setLicense({ ...licenseData }); // 모달 창이 열릴 때 라이선스 데이터 설정
      }
      const currentTime = new Date().toLocaleDateString('en-CA');

      // license.gendate가 ""인 경우 현재 시간으로 업데이트
      if (license.gendate === "") {
        setLicense((prevLicense) => ({
          ...prevLicense,
          gendate: currentTime.toString(),
          regtime : currentTime.toString()
      }));
      }
      else {
        setLicense((prevLicense) => ({
          ...prevLicense,
          regtime: currentTime.toString(),
      }));
      }
  
  },[licenseData]);

   // Edit 버튼 클릭 시 handleEdit 함수 실행
   const handleEditClick = () => {
    handleEdit();
    
    // license 값 BE로 전송
    fetch(`${process.env.REACT_APP_SERVER_URL}/licenseTable/api/editLicense/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(license),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.success){
          setEditAlert({ ...editalert, success: true });
          setTimeout(() => setEditAlert({ ...editalert, success: false }), 2000); // 2초 후 editalert 상태 초기화
          window.location.reload();
        }

        else {
          setEditAlert({ ...editalert, fail: true });
          setTimeout(() => setEditAlert({ ...editalert, fail: false }), 2000); // 2초 후 editalert 상태 초기화
        }
      })
      .catch((error) => {
        console.log("에러:", error)
        setEditAlert({ ...editalert, fail: true });
        setTimeout(() => setEditAlert({ ...editalert, fail: false }), 2000); // 2초 후 editalert 상태 초기화
      });

      getLicense();
  };


    return(
        <Modal
        open={editopen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography  className="modaltitle" id="modal-modal-title" variant="h4" component="h1">
            Edit License
          </Typography>
          <div className="inmodal">
          {editalert.success && <Alert severity="success" sx={{ marginTop: '1rem', marginBottom : '1rem' }}> 수정 완료 </Alert>}
          {editalert.fail && <Alert severity="error" sx={{ marginTop: '1rem', marginBottom : '1rem' }}> Fail </Alert>}

              <TextField id="companyname" label="고객사명" type="text" style={{ width:"100%"}}
              value={license.companyname} onChange={event => setLicense(prevLicense => ({ ...prevLicense, companyname: event.target.value }))} /> <br/><br/>
              
              <TextField id="gendate" label="생성일" type="text" style={{paddingRight : "3%", width : "47%"}} 
              value={license.gendate} onChange={event => setLicense(prevLicense => ({ ...prevLicense, gendate: event.target.value }))} />
              
              <TextField id="expdate" label="만료일" type="text" style={{ width : "50%"}}
              value={license.expdate} onChange={event => setLicense(prevLicense => ({ ...prevLicense, expdate: event.target.value }))} /> <br/><br/>
              
              <TextField id="producttype" label="제품유형" type="text" style={{paddingRight : "2%", width:"32%"}} 
              value={license.producttype} onChange={event => setLicense(prevLicense => ({ ...prevLicense, producttype: event.target.value }))} />
              
              <TextField id="orgcode" label="기관코드" type="text" style={{paddingRight : "2%", width : "32%"}} 
              value={license.orgcode} onChange={event => setLicense(prevLicense => ({ ...prevLicense, orgcode: event.target.value }))}/>
              
              <TextField id="segment" label="세그먼트 수" type="text"style={{ width : "32%"}} 
              value={license.segment} onChange={event => setLicense(prevLicense => ({ ...prevLicense, segment: event.target.value }))} />  <br/><br/>
              
              <TextField id="maxccu" label="최대 동접자 수" type="text" style={{paddingRight : "3%", width:"47%"}}
              value={license.maxccu} onChange={event => setLicense(prevLicense => ({ ...prevLicense, maxccu: event.target.value }))} /> 
              
              <TextField id="execount" label="초과 횟수" type="text" style={{ width:"50%"}}
              value={license.execount} onChange={event => setLicense(prevLicense => ({ ...prevLicense, execount: event.target.value }))} /> <br/><br/>
              
              <TextField id="domain" label="서비스 도메인" type="text" style={{ width:"100%"}}
              value={license.domain} onChange={event => setLicense(prevLicense => ({ ...prevLicense, domain: event.target.value }))} /> <br/><br/>
        </div>
        <div className="modalbutton"> 
          <button className="editsubmit" onClick={handleEditClick} >Edit</button>
        </div>
        </Box>
      </Modal>
    )

}

export default LicenseEditModal;