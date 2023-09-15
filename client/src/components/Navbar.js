import React, {useEffect} from "react";
import "../App.css";
import Sidebar from './Sidebar';
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setEmailUid, setPrivilege } from '../redux/reducers';

const Navbar = ({ googleuser }) => {

  const logout = () => {
    window.open(`${process.env.REACT_APP_SERVER_URL}/auth/logout`, "_self");
  };
  const location = useLocation().pathname;
  const dispatch = useDispatch();

  useEffect(() => {
    if (googleuser) {
      const emailuid = googleuser._json.email.split("@")[0];
      dispatch(setEmailUid(emailuid));
      
       // emailuid 값 BE로 전송
    fetch(`${process.env.REACT_APP_SERVER_URL}/licenseUser/api/selectPrivilege`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify({emailuid}),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        dispatch(setPrivilege(data[0].privilege));
      })      
    }
  } , [googleuser]);

  
  return (    
    <div>
      {googleuser && location !=="/" ? (
        <Sidebar/>
            ) : <></>}
      <div className="navbar">
        <span className="logo">
        {googleuser ? (<Link className="link" to="/main">
            License App
          </Link> ): (<Link className="link" to="/">
            License App
          </Link>)}
        </span>
        {googleuser ? (
          <ul className="list">
            <li className="listItem">
              <img
                src={googleuser.photos[0].value}
                alt=""
                className="avatar"
              />
            </li>
            <li className="listItem">{googleuser.name.familyName}</li>
            <li className="listItem" onClick={logout}>
              Logout
            </li>
          </ul>
        ) : (<></>)}      
      </div>
    </div>
  );
};

export default Navbar;