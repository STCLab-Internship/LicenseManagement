import Google from "../img/google.png";

const GoogleLogin = () => {
  const google = () => {
    window.open(`${process.env.REACT_APP_SERVER_URL}/auth/google`, "_self");
  };

  return (
    <div className="login">
      <h1 className="loginTitle">Google Login</h1>
      <div className="wrapper">
        <div className="left">
          <div className="loginButton google" onClick={google}>
            <img src={Google} alt="" className="icon" />
            Google
          </div>
        </div>
        </div>
    </div>
  );
};

export default GoogleLogin;