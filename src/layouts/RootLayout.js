import { NavLink, Outlet } from "react-router-dom";
import BreadCrumbs from "../components/BreadCrumbs";
import useAuth from "../hooks/useAuth";

/*
          <NavLink to="about">About</NavLink>
          <NavLink to="help">Help</NavLink>
          <NavLink to="blogposts">BlogPosts</NavLink>
          */

export default function RootLayout() {
  const { auth } = useAuth();
  /*  if (auth?.userName) {
    console.log("RootLayout> User logged in");
  } else {
    console.log("RootLayout> No user logged in");
  }
*/
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
              <NavLink to="createpost">Create Post</NavLink>
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
