import React, {useState, useEffect} from "react";
import { useSelector } from 'react-redux';
import './LicenseList.css'
import {DataGrid} from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import LicenseEditModal from "../Modal/LicenseEditModal";
import AddModal from "../Modal/AddModal";
import LicensePwdDeleteModal from "../Modal/LicensePwdDeleteModal";
import LicenseKeyModal from "../Modal/LicenseKeyModal";

export default function LicenseList(){

    const [license, setLicense] = useState([]);
    const privilege = useSelector(state => state.googleUser.privilege);
    const [privilegeState, setPrivilegeState] = useState(privilege);

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

    function handleDelete(id){
      setClickId(id);
      setPwdOpen(true)
    }

    useEffect(()=>{
      getLicense();
    },[])

   //  console.log("license : ",license)

    const [editopen, setEditOpen] = useState(false);
    const [addopen, setAddOpen] = useState(false);
    const [pwdopen, setPwdOpen] = useState(false);
    const [keyopen, setKeyOpen] = useState(false);
    const [clickid, setClickId] = useState(null);
    const [selectedLicense, setSelectedLicense] = useState(null);
    const [licensekey, setLicenseKey] = useState('');

    const handleEditOpen = (id) => {
      setEditOpen(true);
      setClickId(id);
      setSelectedLicense(license.find((item) => item.id === id))
    }

    const handleAddOpen= () => {
      setAddOpen(true);
    }

    const handleShowOpen = (id) => {
      setClickId(id);
      setLicenseKey( (license.find((item) => item.id === id)).licensekey);
      setKeyOpen(true);
    }
    const columns = [

      { field: 'id', headerName: 'ID', width: 60 },
      { field: 'username', headerName: '이름', width: 80 },
      { field: 'regtime', headerName: 'regtime', width: 100, align : 'center' },
      { field: 'gendate', headerName: '생성일', width: 100, align : 'center' },
      { field: 'producttype', headerName: '기업코드', width: 100, align : 'center' },
      { field: 'orgcode', headerName: '기관코드', width: 80, align : 'center' },
      { field: 'expdate', headerName: '만료일', width: 100, align : 'center' },
      { field: 'segment', headerName: '세그먼트 수', width: 100, align : 'center' },
      { field: 'maxccu', headerName: '최대 동접자 수', width: 110, align : 'center' },
      { field: 'execount', headerName: '초과 횟수', width: 80, align : 'center'},
      { field: 'domain', headerName: '서비스 도메인', width: 150 },
      { field: 'companyname', headerName: '고객사명', width: 150 },
      { field: 'show', headerName: '', width: 80,
          renderCell : (params) => { 
            return ( 
              <>
              {privilege === "user" || privilege === "Admin" ? 
              <> <button onClick={() => {handleShowOpen(params.row.id)}} className="licenseKeyShow">Show</button> </>
              : <></>}
              </>)}
      },
      { field: 'action', headerName: '', width: 140,
        renderCell : (params) => {
          return (
            <>
            { (privilege === "user" && privilegeState !== "viewer") || (privilege === "Admin" && privilegeState !== "viewer") ? 
            <>
              <button onClick={() => {handleEditOpen(params.row.id)}} className="licenseListEdit">Edit</button>
              <button onClick={()=> {handleDelete(params.row.id)}} className="licenseListDelete">Delete</button>
              </> : <></>}
            </>)}
      },
    ];

    return (
        <div className="licenselist">
          <div className="licenseTitle">
           <Typography variant="h4">License</Typography>
            {privilege === "user" || privilege === "Admin" ? 
              <button onClick={handleAddOpen} className="licenseListAdd">Add</button>
              : <></>}
           </div>
              <LicenseKeyModal keyopen={keyopen} setKeyOpen={setKeyOpen} licensekey={licensekey}/>
              <LicensePwdDeleteModal pwdopen={pwdopen} setPwdOpen={setPwdOpen} clickid={clickid} license={license} setLicense={setLicense}/> 
              <LicenseEditModal editopen={editopen} setEditOpen={setEditOpen} licenseData={selectedLicense} setLicense={setLicense}/>
              <AddModal addopen={addopen} setAddOpen={setAddOpen}/>
              <div style={{ height: 500, width: '90%' }}>
              <DataGrid 
                disableRowSelectionOnClick
                rows={license}
                columns={columns}
                autoPageSize 
                sortModel={[
                  {
                    field: 'id',
                    sort: 'desc',
                  },
                ]}
              />
            </div>
        </div>
    )
}