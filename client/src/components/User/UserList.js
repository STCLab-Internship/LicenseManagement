import React, {useState, useEffect} from "react";
import { useSelector } from 'react-redux';
import './UserList.css'
import {DataGrid} from '@mui/x-data-grid';
import { DeleteOutline } from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import UserEditModal from "../Modal/UserEditModal";
import UserPwdDeleteModal from "../Modal/UserPwdDeleteModal";

export default function UserList(){

  const privilege = useSelector(state => state.googleUser.privilege);

    const [user, setUser] = useState([]);
    const [editopen, setEditOpen] = React.useState(false);
    const [clickid, setClickId] = useState(null);
    const [pwdopen, setPwdOpen] = React.useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleEditOpen = (id) => {
      setEditOpen(true);
      setClickId(id);
      setSelectedUser(user.find((item) => item.id === id))
    }

    function getUser() {
        fetch(`${process.env.REACT_APP_SERVER_URL}/licenseUser/api/selectUser`)
        .then(response => response.json())
        .then(data => {
          setUser(data);
        })
        .catch(error => {
          console.log("Error fetching users:", error);
        });
    }

    function handleDelete(id){
      setClickId(id);
      setPwdOpen(true);
    }

    useEffect(() => {
        getUser()
      }, []);

    const columns = [

      { field: 'id', headerName: 'ID', width: 120 },
      {
        field: 'username',
        headerName: '이름',
        width: 220,
        
      },
      {
        field: 'privilege',
        headerName: '권한',
        width:220,
        
      },
      {
          field: 'action',
          headerName: 'Action',
          width: 150,
          renderCell : (params) => {
              return (
                <>
                { privilege === "Admin" ? 
                  <>
                    <button onClick={() => {handleEditOpen(params.row.id)}}  className="userListEdit">Edit</button>
                    <DeleteOutline className="userListDelete" onClick={()=> handleDelete(params.row.id)}/>
                  </> : <></>
                }
                </>
              )
          }
      },
    ];

    return (
        <div className="userlist">
          <div className="userTitle">
           <Typography variant="h4">User</Typography>
           </div>
              <UserPwdDeleteModal pwdopen={pwdopen} setPwdOpen={setPwdOpen} clickid={clickid} user={user} setUser={setUser}/> 
              <UserEditModal editopen={editopen} setEditOpen={setEditOpen} userData={selectedUser}/>
            <div style={{ height: 500, width: '90%' }}>
            <DataGrid 
                autoPageSize 
                disableRowSelectionOnClick
                rows={user}
                columns={columns}
            />
            </div>
        </div>
    )
}