import React, {useState, useEffect} from "react";
import { useSelector } from 'react-redux';
import './LicenseHistoryList.css'
import {DataGrid} from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import LicenseKeyModal from "../Modal/LicenseKeyModal";

export default function LicenseHistoryList(){

  const privilege = useSelector(state => state.googleUser.privilege);

  const [licensehistory, setLicenseHistory] = useState([]);
  const [keyopen, setKeyOpen] = useState(false);
  const [clickid, setClickId] = useState(null);
  const [licensekey, setLicenseKey] = useState('');

  function getLicenseHistory() {
    fetch(`${process.env.REACT_APP_SERVER_URL}/licenseHistory/api/selectLicenseHistory`)
    .then(response => response.json())
    .then(data => {
      setLicenseHistory(data);
    })
    .catch(error => {
      console.log("Error fetching users:", error);
    });
}

  useEffect(() => {
    getLicenseHistory()
  }, []);

// console.log("licensehistory : ",licensehistory)

const columns = [
  { field: 'id', headerName: 'ID', width: 60, align:'center' },
  { field: 'username', headerName: '이름', width: 80 },
  { field: 'action', headerName : '종류', width : 80 },
  { field: 'regtime', headerName: 'regtime', width: 100, align : 'center' },
  { field: 'gendate', headerName: '생성일', width: 100, align : 'center' },
  { field: 'producttype', headerName: '기업코드', width: 100, align : 'center' },
  { field: 'orgcode', headerName: '기관코드', width: 80, align : 'center' },
  { field: 'expdate', headerName: '만료일', width: 100, align : 'center'},
  { field: 'segment', headerName: '세그먼트 수', width: 100, align : 'center' },
  { field: 'maxccu',  headerName: '최대 동접자 수',  width: 110, align : 'center' },
  { field: 'execount', headerName: '초과 횟수', width: 80, align : 'center' },
  { field: 'domain', headerName: '서비스 도메인', width: 150 },
  { field: 'companyname', headerName: '고객사명', width: 150 },
];

    return (
        <div className="licenseHistorylist">
          <div className="licenseTitle">
           <Typography variant="h4">License History</Typography>
           </div>
            <LicenseKeyModal keyopen={keyopen} setKeyOpen={setKeyOpen} licensekey={licensekey}/>
            <div style={{ height: 500, width: '90%' }}>
            <DataGrid 
                disableRowSelectionOnClick
                rows={licensehistory}
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