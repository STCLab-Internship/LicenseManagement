import Navbar from "./components/Navbar";
import store from './redux/store'
import { Provider } from 'react-redux';
import "./App.css";
import License from "./pages/License";
import User from "./pages/User";
import GoogleLogin from "./pages/GoogleLogin";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LicenseHistory from "./pages/LicenseHistroy";

const App = () => {
  const [googleuser, setGoogleUser] = useState(null);

  const getGoogleUser = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/auth/login/success`, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        throw new Error("authentication has been failed!");
      })
      .then((resObject) => {
        setGoogleUser(resObject.user);
      })
      .catch((err) => {
        console.log(err);
      });
  };
 
  useEffect(() => {
    getGoogleUser();
  }, []);

 // console.log(googleuser)

  return (
    <Provider store={store}>
    <BrowserRouter>
      <div>
        <Navbar googleuser={googleuser} />
        <Routes>
          <Route path="/history" element={ googleuser ? <LicenseHistory/> : <Navigate to="/"/> }/>
          <Route path="/user" element={ googleuser ? <User/> : <Navigate to="/"/> }/>
          <Route path="/main" element={googleuser ? <License/> : <Navigate to="/"/>}/>
          <Route path="/" element={ googleuser ? <Navigate to="/main"/> : <GoogleLogin />} />
        </Routes>
      </div>
    </BrowserRouter>
    </Provider>
  );
};

export default App;