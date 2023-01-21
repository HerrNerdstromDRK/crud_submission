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
          <NavLink to="/">Inventory</NavLink>
          {auth?.userName ? (
            <>
              {" "}
              <NavLink to={"inventoryitems/" + auth.userName}>
                My Inventory Items{" "}
              </NavLink>
              <NavLink to="createinventoryitem">Create Item</NavLink>
              <NavLink to="logout">Logout</NavLink>
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
