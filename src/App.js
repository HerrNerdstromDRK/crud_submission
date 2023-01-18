//import logo from "./logo.svg";
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

import Home from "./pages/Home";
//import About from "./pages/About";
import BlogPosts from "./pages/BlogPosts/BlogPosts";
//import Faq from "./pages/help/Faq";
//import Contact, { contactAction } from "./pages/help/Contact";
import BlogPost, {
  blogPostButtonHandler,
  blogPostLoader,
} from "./pages/BlogPosts/BlogPost";
import { blogPostsLoader } from "./loaders/blogPostsLoader";
import { blogPostsByUserNameLoader } from "./loaders/blogPostsByUserNameLoader";
import CreatePost, { createPostAction } from "./pages/BlogPosts/CreatePost";
import UpdatePost, {
  updatePostAction,
  updatePostLoader,
} from "./pages/BlogPosts/UpdatePost";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Logout from "./pages/BlogPosts/Logout";

// Layouts
import RootLayout from "./layouts/RootLayout";
//import HelpLayout from "./layouts/HelpLayout";
//import BlogPostsLayout from "./layouts/BlogPostsLayout";
//import CreatePostLayout from "./layouts/CreatePostLayout";
//import BlogPostsError from "./pages/BlogPosts/BlogPostError";
import RequireAuth from "./components/RequireAuth";
import useAuth from "./hooks/useAuth";

/*
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="help" element={<HelpLayout />}>
        <Route path="faq" element={<Faq />} />
        <Route path="contact" element={<Contact />} action={contactAction} />
      </Route>

            <Route
        path="blogposts"
        element={<BlogPostsLayout />}
        errorElement={<BlogPostsError />}
      >
      </Route>
*/

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
        />
        <Route
          path="/blogpost/:id"
          element={<BlogPost />}
          loader={blogPostLoader}
          action={blogPostButtonHandler}
        />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />
        <Route
          path="updatepost/:id"
          element={<UpdatePost />}
          loader={updatePostLoader}
          action={updatePostAction}
        />
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
        <Route path="*" element={<Home />} /> {/* catch-all path */}
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
