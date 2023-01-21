import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../api/axios";
import "../App.css";

const FIRSTNAME_REGEX = /^[a-zA-Z]{1,100}$/;
const LASTNAME_REGEX = /^[a-zA-Z]{1,100}$/;
const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/inventoryitemusers/register";

/**
 * Component to register a new users. Note this is a pre-v6 method.
 * @returns
 */
const Register = () => {
  // Place focus on first/last name input when page loads
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const userNameRef = useRef();

  // errRef will put focus on any errors during validation
  const errRef = useRef();

  // Username
  const [userName, setUserName] = useState("");

  // Boolean to check if userName validates
  const [validUserName, setValidUserName] = useState(false);

  // Do the same for first name and last name
  const [firstName, setFirstName] = useState("");
  const [validFirstName, setValidfirstName] = useState(false);
  const [lastName, setLastName] = useState("");
  const [validLastName, setValidLastName] = useState(false);

  // Focus on input field or not
  const [firstNameFocus, setFirstNameFocus] = useState(true);
  const [lastNameFocus, setLastNameFocus] = useState(false);
  const [userNameFocus, setUserNameFocus] = useState(false);

  // Do the same for tracking the password
  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  // And for the second password for a match
  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  // Track if an error exists; same for success
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  // Set focus on firstName input
  useEffect(() => {
    firstNameRef.current.focus();
  }, []); // Set focus only on user load

  // Validate firstName input
  useEffect(() => {
    const result = FIRSTNAME_REGEX.test(firstName);
    /*
    console.log(
      "Register> FIRSTNAME_REGEX validation: " +
        result +
        " for firstName: " +
        firstName
    );
    */
    setValidfirstName(result);
  }, [firstName]);

  // Validate lastName input
  useEffect(() => {
    const result = LASTNAME_REGEX.test(lastName);
    /*    console.log(
      "Register> LASTNAME_REGEX validation: " +
        result +
        " for lastName: " +
        lastName
    );
    */
    setValidLastName(result);
  }, [lastName]);

  // Validate userName input
  useEffect(() => {
    const result = USERNAME_REGEX.test(userName);
    /*
    console.log(
      "Register> USERNAME_REGEX validation: " +
        result +
        " for user: " +
        userName
    );
    */
    setValidUserName(result);
  }, [userName]); // Check any time the userName input field changes

  // Validate password input
  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    /*
    console.log(
      "Register> PWD_REGEX validation: " + result + " for pwd: " + pwd
    );
    */
    setValidPwd(result);

    // One extra step to determine valid password since Register requires the
    // user to enter the password twice
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  // Clear error message any time the user changes any input field
  useEffect(() => {
    setErrMsg("");
  }, [firstName, lastName, userName, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    // Prevent keeping the default behavior (no caching the password)
    //    console.log("Register.handleSubmit>");
    e.preventDefault();

    // Prevent inject attacks by validating again
    const validFirstName = FIRSTNAME_REGEX.test(firstName);
    const validLastName = LASTNAME_REGEX.test(lastName);
    const validUserName = USERNAME_REGEX.test(userName);
    const validPassword = PWD_REGEX.test(pwd);
    if (!validFirstName || !validLastName || !validUserName || !validPassword) {
      setErrMsg("Invalid first name, last name, username, or password");
      return;
    }
    try {
      //const response =
      await api.post(
        REGISTER_URL,
        JSON.stringify({ firstName, lastName, userName, pwd }),
        {
          headers: {
            "Content-Type": "application/json",
            withCredentials: true,
          },
        }
      );
      //      console.log("Register> api response: " + JSON.stringify(response));

      // Set the success property so the below component draws correctly
      setSuccess(true);

      // Clear the inputs
      setFirstName("");
      setLastName("");
      setUserName("");
      setPwd("");
      setMatchPwd("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No server response");
      } else if (err.response?.status === 409) {
        setErrMsg("Username taken");
      } else {
        setErrMsg("Registration failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <Link to="/login">Sign In</Link>
          </p>
        </section>
      ) : (
        <section>
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}>
            {errMsg}
          </p>
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="firstname">
              First Name:
              <FontAwesomeIcon
                icon={faCheck}
                className={validFirstName ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={!validFirstName || firstName ? "hide" : "invalid"}
              />
            </label>
            <input
              type="text"
              id="firstname"
              ref={firstNameRef}
              autoComplete="off"
              onChange={(e) => setFirstName(e.target.value)}
              required
              aria-invalid={validFirstName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setFirstNameFocus(true)}
              onBlur={() => setFirstNameFocus(false)}
            />
            <p
              id="uidnote"
              className={
                firstNameFocus && firstName && !validFirstName
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              1 to 100 characters.
              <br />
              Must include only upper and lower case numbers.
            </p>{" "}
            <label htmlFor="lastname">
              Last Name:
              <FontAwesomeIcon
                icon={faCheck}
                className={validLastName ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={!validLastName || lastName ? "hide" : "invalid"}
              />
            </label>
            <input
              type="text"
              id="lastname"
              autoComplete="off"
              ref={lastNameRef}
              onChange={(e) => setLastName(e.target.value)}
              required
              aria-invalid={validLastName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setLastNameFocus(true)}
              onBlur={() => setLastNameFocus(false)}
            />
            <p
              id="uidnote"
              className={
                lastNameFocus && lastName && !validLastName
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              1 to 100 characters.
              <br />
              Must include only upper and lower case numbers.
            </p>{" "}
            <label htmlFor="username">
              UserName:
              <FontAwesomeIcon
                icon={faCheck}
                className={validUserName ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validUserName || !userName ? "hide" : "invalid"}
              />
            </label>
            <input
              type="text"
              id="username"
              autoComplete="off"
              ref={userNameRef}
              onChange={(e) => setUserName(e.target.value)}
              required
              aria-invalid={validUserName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setUserNameFocus(true)}
              onBlur={() => setUserNameFocus(false)}
            />
            <p
              id="uidnote"
              className={
                userNameFocus && userName && !validUserName
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>{" "}
            <label htmlFor="password">
              Password:
              <FontAwesomeIcon
                icon={faCheck}
                className={validPwd ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validPwd || !pwd ? "hide" : "invalid"}
              />
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
              aria-invalid={validPwd ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />
            <p
              id="pwdnote"
              className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              8 to 24 characters.
              <br />
              Must include uppercase and lowercase letters, a number and a
              special character.
              <br />
              Allowed special characters:{" "}
              <span aria-label="exclamation mark">!</span>{" "}
              <span aria-label="at symbol">@</span>{" "}
              <span aria-label="hashtag">#</span>{" "}
              <span aria-label="dollar sign">$</span>{" "}
              <span aria-label="percent">%</span>
            </p>
            <label htmlFor="confirm_pwd">
              Confirm Password:
              <FontAwesomeIcon
                icon={faCheck}
                className={validMatch && matchPwd ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validMatch || !matchPwd ? "hide" : "invalid"}
              />
            </label>
            <input
              type="password"
              id="confirm_pwd"
              onChange={(e) => setMatchPwd(e.target.value)}
              value={matchPwd}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            <p
              id="confirmnote"
              className={
                matchFocus && !validMatch ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must match the first password input field.
            </p>
            <button
              disabled={
                !validUserName || !validPwd || !validMatch ? true : false
              }
            >
              Sign Up
            </button>
          </form>
          <p></p>
          Already registered?
          <br />
          <Link to="/login">Sign In</Link>
        </section>
      )}
    </>
  );
};

export default Register;
