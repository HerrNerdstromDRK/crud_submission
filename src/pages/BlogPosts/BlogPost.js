import { Form, redirect, useLoaderData, Navigate } from "react-router-dom";

import api from "../../api/axios";
import "../../App.css";
import useAuth from "../../hooks/useAuth";

export default function BlogPost() {
  const theBlogPost = useLoaderData();
  const { auth } = useAuth();

  if (null == theBlogPost) {
    // No blog post found
    // Could be that the form and below action have already executed and
    // deleted the blog post.
    return <Navigate to="/" replace />;
  }
  return (
    <div className="blogpost-details">
      <h2>Blog post details for {theBlogPost.title}</h2>
      <p>Author: {theBlogPost.author}</p>
      <p>Date Modified: {theBlogPost.modifieddate}</p>

      <div className="details">
        <p>Content: {theBlogPost.content}</p>
      </div>
      <div>
        {auth?.userName && auth.userName === theBlogPost.author ? (
          <>
            <Form method="POST">
              <button type="submit">Update Post</button>
            </Form>
            <Form method="delete">
              <button type="submit">Delete Post</button>
            </Form>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
/*        
          <>
                    </>
        ) : (
          <></>
        )}
          */

export const blogPostButtonHandler = async ({ request, params }) => {
  //  const data = await request.formData();
  const { id } = params;

  switch (request.method) {
    case "PUT": {
      //      console.log("blogPostButtonHandler> PUT id: " + id);
      return redirect("/updatepost/" + id);
    }
    case "DELETE": {
      //console.log("blogPostButtonHandler> DELETE id: " + id);
      deleteBlogPost(id);
      //  console.log("blogPostButtonHandler> Redirecting to blogposts");
      return redirect("/");
    }
    default: {
      throw new Response("Invalid request method for blog post", {
        status: 405,
      });
    }
  }
};

export const deleteBlogPost = async (id) => {
  console.log("deleteBlogPost> Deleting blog id: " + id);
  try {
    //const response =
    await api.delete("/blogposts/" + id);
    //    console.log(
    //      "deleteBlogPost> response.data: " + JSON.stringify(response.data)
    //    );
  } catch (err) {
    if (err.response) {
      // Not in the 200 response range
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
    } else {
      // No response or non-200 error
      console.log(`deleteBlogPost> Error: ${err.message}`);
    }
  }
  // Navigation/redirection is handled in the component or blogPostButtonHandler
};

// Loader function
export const blogPostLoader = async ({ params }) => {
  // Destructure id from the parameters
  const { id } = params;

  // Once the code above is invoked, specifically to delete the blog post,
  // this function will be called again. The problem is that the params.id
  // field will point to an invalid id
  // Need to send a signal back to the component that the blog is already
  // deleted and it should Navigate the user to a different page.

  try {
    const response = await api.get("/blogposts/" + id);
    console.log(
      "blogPostsLoader> response.data: " + JSON.stringify(response.data)
    );
    if (!response?.data) {
      // No blog entry found, return null data to communicate to the Component
      // that no blog entry exists
      //      console.log("blogPostLoader> Found null blog entry: " + id);
      response.data = null;
    }
    return response.data;
  } catch (err) {
    console.log("blogPostLoader> data: " + JSON.stringify(err.response.data));
    console.log("blogPostLoader> status: " + err.response.status);
    if (err.response.status === 404) {
      // Blog post not found.
      console.log("blogPostLoader> Found 404, throwing exception");
      throw new Response("Blog ID not found", { status: 404 });
    } else if (err.response) {
      // Not in the 200 response range
      console.log("blogPostLoader> Error status: " + err.response.status);
      console.log(
        "blogPostLoader> Error data: " + JSON.stringify(err.response.data)
      );
      //      console.log(err.response.headers);
    } else {
      // No response or non-200 error
      console.log(`blogPostsLoader> Error: ${err.message}`);
    }
  }
  return [];
};
