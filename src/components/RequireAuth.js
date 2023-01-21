import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

/**
 * Used to provide protected routes.
 * @returns
 */
const RequireAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();

  // Front end hook to redirect the user to the child component (any child
  // wrapped by RequireAuth) if logged in (Outlet),
  // or to the login page if not logged in.
  // replace will remove this current page from the navigation history.
  return auth?.userName ? (
    <Outlet context={{ userName: auth.userName }} />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
