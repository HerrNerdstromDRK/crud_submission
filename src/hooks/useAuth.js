import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

// This function is intended to make useing the auth context easier in
// the other js files.
const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
