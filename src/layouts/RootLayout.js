import { NavLink, Outlet } from "react-router-dom";
import BreadCrumbs from "../components/BreadCrumbs";
import useAuth from "../hooks/useAuth";

export default function RootLayout() {
  const { auth } = useAuth();

  return (
    <div className="root-layout">
      <header>
        <nav>
          <h1>Karrels CRUD</h1>
          <NavLink to="/">Home</NavLink>
          {auth?.userName ? (
            <>
              {" "}
              <NavLink to="logout">Logout</NavLink>
              <NavLink to="createinventoryitem">Create Item</NavLink>
            </>
          ) : (
            <>
              {" "}
              <NavLink to="login">Login</NavLink>
              <NavLink to="register">Register</NavLink>
            </>
          )}
        </nav>
        <BreadCrumbs />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
