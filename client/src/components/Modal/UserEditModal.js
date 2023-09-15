import React, {useState, useEffect} from "react";
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import './LicenseEditModal.css';
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

  const privilegeList = [
    { value : 'Admin', label : 'Admin'},
    { value : 'viewer', label : 'viewer'},
    { value : 'user', label : 'user'}
  ]

function UserEditModal({editopen, setEditOpen, userData}){

    const [user, setUser] = useState({...userData});
    const [editalert, setEditAlert] = useState({
      success : false
    })

    const handleClose = () => setEditOpen(false);
    
    useEffect(()=>{
      if (userData) {
        setUser({ ...userData }); // 모달 창이 열릴 때 라이선스 데이터 설정
      }

    }, [userData]);// Edit 버튼 클릭 시 handleEdit 함수 실행


    const handleEditClick = () => {
 
     // license 값 BE로 전송
     fetch(`${process.env.REACT_APP_SERVER_URL}/licenseUser/api/editUser/`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify(user),
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
       })
       .catch((error) => {
         console.log("에러:", error)
       });
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
            Edit User
          </Typography>
          <div className="inmodal">
          {editalert.success && <Alert severity="success" sx={{ marginTop: '1rem', marginBottom : '1rem' }}> 수정 완료 </Alert>}
            <br/>
              <TextField id="username" label="이름" type="text" style={{ width:"100%"}}
              value={user.username} onChange={event => setUser(prevUser => ({ ...prevUser, username: event.target.value }))} /> <br/><br/>
              
              <TextField id="previlege" select label="권한" value={user.privilege} style={{ width:"100%"}} 
                onChange={event => setUser(prevUser => ({ ...prevUser, privilege: event.target.value }))} >
                  {privilegeList.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
              </TextField> <br/><br/>
        </div>
        <div className="modalbutton"> 
          <button className="editsubmit" onClick={handleEditClick} >Edit</button>
        </div>
        </Box>
      </Modal>
    )

}

export default UserEditModal;