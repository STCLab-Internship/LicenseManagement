import axios from 'axios';
import React, {useState} from "react";
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import './LicenseEditModal.css'
import Alert from '@mui/material/Alert';

const style = {
    position: 'absolute',
    top: '50%',
    left: '60%',
    transform: 'translate(-50%, -50%)',
    width: '30%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

function LicensePwdDeleteModal({pwdopen, setPwdOpen, clickid, license, setLicense}){

    const [password, setPassWord] = useState('');
    const [deletealert, setDeleteAlert] = useState({
      success : false,
      fail : false
    })


    const handleClose = () => setPwdOpen(false);

    const handlePwd = (event) => {

      event.preventDefault();

      // 서버에 비밀번호 인증 요청 보내기
      axios.post(`${process.env.REACT_APP_SERVER_URL}/pwd/api/verifyPassword`, { password })
      .then(res => {
        if (res.data && res.data.success) {
          setDeleteAlert({ ...deletealert, success: true });
          setTimeout(() => setDeleteAlert({ ...deletealert, success: false }), 2000); // 2초 후 deletealert 상태 초기화
          
            axios.delete(`${process.env.REACT_APP_SERVER_URL}/licenseTable/api/deleteLicense/${clickid}`)
            .then(res => {
              setLicense(license.filter((item) => item.id !== clickid))
            })
            .catch(error => console.log(error));
            window.location.reload();
        } else {
          setDeleteAlert({ ...deletealert, fail: true });
          setTimeout(() => setDeleteAlert({ ...deletealert, fail: false }), 2000); // 2초 후 deletealert 상태 초기화
        }
      })
      .catch(error => {
        console.error('비밀번호 인증 오류:', error);
      });
    }

    return(
        <Modal
        open={pwdopen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography  className="modaltitle" id="modal-modal-title" variant="h4" component="h1">
            Password Check
          </Typography>
          <form onSubmit={handlePwd}>
          <div className="inmodal">
          {deletealert.success && <Alert severity="success" sx={{ marginTop: '1rem' }}> 비밀번호 인증완료 </Alert>}
          {deletealert.fail && <Alert severity="error" sx={{ marginTop: '1rem' }}> 비밀번호 인증실패 </Alert>}
            <br/>
              <TextField id="password" label="비밀번호" type="password" style={{ width:"100%"}}
              value={password} onChange={event => setPassWord(event.target.value)} /> <br/><br/>
        </div>
        <div className="modalbutton"> 
          <button type="submit" className="editsubmit" > 확인 </button>
        </div>
        </form>
        </Box>
      </Modal>
    )

}

export default LicensePwdDeleteModal;