import React from "react";
import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import api from "../api/axios";
import useAuth from "../hooks/useAuth";

const LOGIN_URL = "/inventoryitemusers/authenticate";

/**
 * Component to handle a user login. Note this is a pre-v6 method.
 * @returns
 */
const Login = () => {
  // Capture the stateful auth context
  const { auth, setAuth } = useAuth();

  const navigate = useNavigate();
  //const location = useLocation();
  //  const from = location.state?.from?.pathname || "/";

  // Keep two references: one for userName and the other for the err message
  const userNameRef = useRef();
  const errRef = useRef();

  const [userName, setUserName] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  // Start with focus on username
  useEffect(() => {
    userNameRef.current.focus();
  }, []);

  // Reset the err message anytime the user is changing something
  useEffect(() => {
    setErrMsg("");
  }, [userName, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //    console.log("Login.handleSubmit> userName: " + userName + ", pwd: " + pwd);

    try {
      const response = await api.post(
        LOGIN_URL,
        JSON.stringify({ userName, pwd }),
        {
          headers: { "Content-Type": "application/json" },
          //          withCredentials: true,
        }
      );
      // Post condition: login successful (errors handled through catch below)
      //      console.log(
      //        "Login.handleSubmit> response: " + JSON.stringify(response.data)
      //      );

      const accessToken = response?.data?.accessToken;
      //      console.log("Login.handleSubmit> accessToken: " + accessToken);

      // Save the login information in the global auth context
      setAuth({ userName, pwd, accessToken });

      // Clear form state data
      setUserName("");
      setPwd("");

      // Send the user to its original destination if routed here via protected route
      //      navigate(from, { replace: true });
      navigate("/inventoryitems/" + auth.userName);
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No server response");
      } else {
        setErrMsg(JSON.stringify(err.response.data.message));
      }
    }
  };

  if (auth?.userName) {
    return <Navigate replace to={"/inventoryitems/" + auth.userName} />;
  }

  return (
    <section>
      <p
        ref={errRef}
        className={errMsg ? "errMsg" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          ref={userNameRef}
          autoComplete="off"
          onChange={(e) => setUserName(e.target.value)}
          value={userName}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPwd(e.target.value)}
          value={pwd}
          required
        />
        <button>Sign In</button>
      </form>
      <p>
        Need an Account?
        <br />
        <Link to="/register">Sign Up</Link>
      </p>
    </section>
  );
};

export default Login;
