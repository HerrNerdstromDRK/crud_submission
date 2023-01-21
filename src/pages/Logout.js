import { useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";

/**
 * Provide the user an opportunity to logout. This effictively
 * a two-step logout process so the user can be certain of the decision.
 * @returns
 */
const Logout = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = async () => {
    setAuth({});
    navigate("/");
  };

  if (!auth?.userName) {
    // User is logged out
    return <Navigate to="/" replace />;
  }
  return (
    <div>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Logout;
