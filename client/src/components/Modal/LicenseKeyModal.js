import axios from 'axios';
import React, {useState} from "react";
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import './LicenseEditModal.css'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
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

function LicenseKeyModal({keyopen, setKeyOpen, licensekey}){

    const [copy, setCopy] = useState(false);
    const handleClose = () => setKeyOpen(false);

    const handleShow = () => {
        setKeyOpen(false);
    }; 

    const handleCopy = () => {
      // 라이선스 키가 비어있지 않은 경우에만 클립보드에 복사합니다.
      if (licensekey!==null) {
        navigator.clipboard.writeText(licensekey);
        setCopy(true); // copy success update
        setTimeout(() => setCopy(false), 2000); // 2초 후 copy state 초기화
      }
    };

    return(
        <Modal
        open={keyopen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography  className="modaltitle" id="modal-modal-title" variant="h4" component="h1">
            License Key
          </Typography>
          <div className="inmodal">
            <ContentCopyIcon style={{marginLeft : "90%", cursor:"pointer"}} onClick={handleCopy}/>
            <div className='copyalert'>
              {copy && <Alert severity="success" sx={{ marginTop: '1rem' }}>복사 완료</Alert>} <br/>
            </div>
              <TextField id="licensekey" label="라이선스 키" type="text" style={{ width:"100%"}}
              multiline rows={3} value={licensekey} /> <br/><br/>
        </div>
        <div className="modalbutton"> 
          <button className="editsubmit" onClick={handleShow}> 확인 </button>
        </div>
        </Box>
      </Modal>
    )

}

export default LicenseKeyModal;