import React, {useState, useEffect} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setPrivilege } from '../../redux/reducers';
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
    width: 750,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

function AddModal({addopen, setAddOpen}){
  const familyName = useSelector(state => state.googleUser.familyName);
  const emailuid = useSelector(state => state.googleUser.emailUid);
  const privilege = useSelector(state => state.googleUser.privilege);
  const [privilegeState, setPrivilegeState] = useState(privilege);

  const [isInputFinished, setIsInputFinished] = useState({
    gendate : false,
    expdate : false,
    producttype : false,
    orgcode : false,
    segment : false,
    maxccu : false,
    execount : false,
    domain : false,
    companyname : false,
    licensekey : false
  }); // 입력이 완료되었음으로 초기값을 true로 설정

  const [addalert, setAddAlert] = useState({
    success : false,
    fail : false
  })
  const dispatch = useDispatch();

  const [license, setLicense] = useState({
      emailuid : emailuid,
      username : familyName,
      regtime : "",
      gendate : "",
      expdate : "",
      producttype : "",
      orgcode : "",
      segment : "",
      maxccu : "",
      execount : "",
      domain : "",
      companyname : "",
      licensekey : ""
    })

  const handleClose = () => setAddOpen(false);
    function handleAdd(){
      const currentTime = new Date().toLocaleDateString('en-CA'); // 'yyyy-mm-dd' 형식으로 날짜를 포맷팅

      // license 객체를 업데이트하고 regtime과 gendate에 현재 시각 저장
      setLicense((prevLicense) => ({
        ...prevLicense,
        regtime: currentTime.toString(),
        gendate: currentTime.toString(),
      }));
    }

    // useEffect 훅 사용
    useEffect(() => {
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
    }, [license.gendate]);

    async function fetchData() {
      try {
        // console.log("emailUid : ",emailuid)

        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/licenseUser/api/selectPrivilege`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emailuid }),
        });
    
        const data = await response.json();
        // try 블록 내에서 data[0].privilege를 확인하고 처리
        if (data[0].privilege) {
          dispatch(setPrivilege(data[0].privilege));
          setPrivilegeState(data[0].privilege);
        }
      } catch (error) {
        console.error("에러:", error);
      }
    }

    useEffect(()=>{
      console.log();
    },[privilegeState])
    
    
    // ADD 버튼 클릭 시 handleAdd 함수 실행
    const handleAddClick = async () => {
      handleAdd();  
      await fetchData();
      
      if (privilegeState !== "viewer"){
      // license 값 BE로 전송
      fetch(`${process.env.REACT_APP_SERVER_URL}/licenseTable/api/addLicense/`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(license),
      })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.success){
          setAddAlert({ ...addalert, success: true });
          if (addalert.success) {
            setLicense({
              emailuid : emailuid,
              username : familyName,
              regtime : "",
              gendate : "",
              expdate : "",
              producttype : "",
              orgcode : "",
              segment : "",
              maxccu : "",
              execount : "",
              domain : "",
              companyname : "",
              licensekey : ""
            });
          }
          setTimeout(() => setAddAlert({ ...addalert, success: false }), 1000); // 1초 후 deletealert 상태 초기화
          window.location.reload();
        }
        else {
          setAddAlert({ ...addalert, fail: true });
          setTimeout(() => setAddAlert({ ...addalert, fail: false }), 1000); // 1초 후 deletealert 상태 초기화
        }
      })
      .catch((error) => {
        console.log("에러:", error)
        setAddAlert({ ...addalert, fail: true });
        setTimeout(() => setAddAlert({ ...addalert, fail: false }), 1000); // 1초 후 deletealert 상태 초기화
      });
    }
    else {
      setAddAlert({ ...addalert, fail: true });
      setTimeout(() => setAddAlert({ ...addalert, fail: false }), 1000); // 1초 후 deletealert 상태 초기화
      window.location.reload();
    }
  };
  
    return(
        <Modal
        open={addopen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography  className="modaltitle" id="modal-modal-title" variant="h4" component="h1">
            Add License
          </Typography>
          <div className="inmodal">  
          {addalert.success && <Alert severity="success" sx={{ marginTop: '1rem', marginBottom : '1rem' }}> 추가 완료 </Alert>}
          {addalert.fail && <Alert severity="error" sx={{ marginTop: '1rem', marginBottom : '1rem' }}> Fail </Alert>}

             <TextField id="companyname" label="고객사명" type="text" style={{ width:"100%" }}
              placeholder="에스티씨랩" value={license.companyname} onChange={(event) => {setLicense(prevLicense => ({ ...prevLicense, companyname: event.target.value }))
             }} /><br/><br/>
                          
              <TextField id="gendate" label="생성일" type="text" style={{paddingRight : "3%", width : "47%"}} 
              placeholder="2023-07-17" value={license.gendate} onChange={event => setLicense(prevLicense => ({ ...prevLicense, gendate: event.target.value }))} />
              
              <TextField id="expdate" label="만료일" type="text" style={{ width : "50%"}}
              placeholder="2023-08-01" value={license.expdate} onChange={event => setLicense(prevLicense => ({ ...prevLicense, expdate: event.target.value }))} /> <br/><br/>
              
              <TextField id="producttype" label="제품유형" type="text" style={{paddingRight : "2%", width:"32%"}} 
              placeholder="1" value={license.producttype} onChange={event => setLicense(prevLicense => ({ ...prevLicense, producttype: event.target.value }))} />
              
              <TextField id="orgcode" label="기관코드" type="text" style={{paddingRight : "2%", width : "32%"}} 
              placeholder="11001" value={license.orgcode} onChange={event => setLicense(prevLicense => ({ ...prevLicense, orgcode: event.target.value }))}/>
              
              <TextField id="segment" label="세그먼트 수" type="text"style={{ width : "32%"}} 
              placeholder="30" value={license.segment} onChange={event => setLicense(prevLicense => ({ ...prevLicense, segment: event.target.value }))} />  <br/><br/>
              
              <TextField id="maxccu" label="최대 동접자 수" type="text" style={{paddingRight : "3%", width:"47%"}}
              placeholder="20000" value={license.maxccu} onChange={event => setLicense(prevLicense => ({ ...prevLicense, maxccu: event.target.value }))} /> 
              
              <TextField id="execount" label="초과 횟수" type="text" style={{ width:"50%"}}
              placeholder="3" value={license.execount} onChange={event => setLicense(prevLicense => ({ ...prevLicense, execount: event.target.value }))} /> <br/><br/>
              
              <TextField id="domain" label="서비스 도메인" type="text" style={{ width:"100%"}}
              placeholder="stclab.com" value={license.domain} onChange={event => setLicense(prevLicense => ({ ...prevLicense, domain: event.target.value }))} /> <br/><br/>
        </div>
        <div className="modalbutton"> 
          <button className="addsubmit" onClick={handleAddClick} >Add</button>
        </div>
        </Box>
      </Modal>
    )

}

export default AddModal;