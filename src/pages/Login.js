import React from "react";
import { useRef, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import AuthContext from "../context/AuthProvider";

const LOGIN_URL = "/blogusers/authenticate";

const Login = () => {
  // Capture the stateful auth context
  const { setAuth } = useContext(AuthContext);

  // Keep two references: one for userName and the other for the err message
  const userNameRef = useRef();
  const errRef = useRef();

  const [userName, setUserName] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

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
    // TODO: backend login
    console.log("Login.handleSubmit> userName: " + userName + ", pwd: " + pwd);

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
      console.log(
        "Login.handleSubmit> response: " + JSON.stringify(response.data)
      );

      const accessToken = response?.data?.accessToken;
      console.log("Login.handleSubmit> accessToken: " + accessToken);

      // Save the login information in the global auth context
      setAuth({ userName, pwd, accessToken });

      // Clear form state data
      setUserName("");
      setPwd("");
      setSuccess(true);
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No server response");
      } else {
        setErrMsg(JSON.stringify(err.response.data.message));
      }
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>You are logged in!</h1>
          <br />
          <Link to="/index">Go to home</Link>
        </section>
      ) : (
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
      )}
    </>
  );
};

export default Login;
