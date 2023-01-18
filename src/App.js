import "./App.css";

// useState is used by React to update the DOM and interface based on changes
// useRef allow us to capture data from user input via the web interface
// useEffect is a hook that allows us to store data persistently
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import BlogPosts from "./pages/BlogPosts/BlogPosts";
import BlogPost, {
  blogPostButtonHandler,
  blogPostLoader,
} from "./pages/BlogPosts/BlogPost";
import { blogPostsLoader } from "./loaders/blogPostsLoader";
import { blogPostsByUserNameLoader } from "./loaders/blogPostsByUserNameLoader";
import CreatePost, { createPostAction } from "./pages/BlogPosts/CreatePost";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Logout from "./pages/BlogPosts/Logout";

// Layouts
import RootLayout from "./layouts/RootLayout";
import BlogPostsError from "./pages/BlogPosts/BlogPostError";
import RequireAuth from "./components/RequireAuth";
import useAuth from "./hooks/useAuth";

function App() {
  const { auth } = useAuth();
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        {/* Route to retrieve items from all users */}
        <Route index element={<BlogPosts />} loader={blogPostsLoader} />
        <Route
          path="/blogposts"
          element={<BlogPosts />}
          loader={blogPostsLoader}
        />
        <Route
          path="/blogposts/:userName"
          element={<BlogPosts />}
          loader={blogPostsByUserNameLoader}
          errorElement={<BlogPostsError />}
        />
        <Route
          path="/blogpost/:id"
          element={<BlogPost />}
          loader={blogPostLoader}
          action={blogPostButtonHandler}
          errorElement={<BlogPostsError />}
        />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />
        {/* Protected routes */}
        <Route element={<RequireAuth />}>
          <Route
            path="createpost"
            element={<CreatePost />}
            action={createPostAction({ auth })}
          />
          {/* Protected route for items for this user only */}
        </Route>
        {/* Catch all */}
        <Route path="*" element={<BlogPosts />} loader={blogPostsLoader} />{" "}
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
