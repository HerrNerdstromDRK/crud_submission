import { Form, redirect, useLoaderData, Navigate } from "react-router-dom";

import api from "../../api/axios";
import "../../App.css";
import useAuth from "../../hooks/useAuth";

let blogAuthor = null;

export default function BlogPost() {
  const theBlogPost = useLoaderData();
  if (null == blogAuthor && theBlogPost != null) {
    // Record the userName when this page first loads.
    // That way, if the post is deleted, and theBlogPost information
    // is therefore lost, we can still redirect the user to the posts
    // owned by the author of the original post.
    blogAuthor = theBlogPost.author;
    //    console.log("BlogPost> Caught author: " + blogAuthor);
  }
  // Check if the user is logged in
  const { auth } = useAuth();

  if (null == theBlogPost) {
    // No blog post found
    // Could be that the form and below action have already executed and
    // deleted the blog post.
    return <Navigate to={"/blogposts/" + blogAuthor} replace />;
  }
  return (
    <div className="blogpost-details">
      <h2>Blog post details for {theBlogPost.title}</h2>
      <p>Author: {theBlogPost.author}</p>
      <p>Date Modified: {theBlogPost.modifieddate}</p>

      <div className="details">
        <p>
          Content:{" "}
          {!auth?.userName && theBlogPost.content.length > 100
            ? theBlogPost.content.substring(0, 99) + "..."
            : theBlogPost.content}
        </p>
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

export const blogPostButtonHandler = async ({ request, params }) => {
  //  const data = await request.formData();
  const { id } = params;

  switch (request.method) {
    case "PUT": {
      //      console.log("blogPostButtonHandler> PUT id: " + id);
      // TODO: Make this update in place
      return redirect("/updatepost/" + id);
    }
    case "DELETE": {
      //console.log("blogPostButtonHandler.delete> DELETE id: " + id);
      deleteBlogPost(id);
      if (blogAuthor != null) {
        // Successfully deleted the blogPost and returned the owning userName
        //  console.log("blogPostButtonHandler.delete> Redirecting to blogposts");
        return redirect("/blogposts/" + blogAuthor);
      }

      // Either failed to delete blogPost or failed to find/return the owning
      // userName
      // Redirect to the root page
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
  //  console.log("deleteBlogPost> Deleting blog id: " + id);
  try {
    await api.delete("/blogposts/" + id);
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

  //  console.log("blogPostLoader> id: " + id);

  // Once the code above is invoked, specifically to delete the blog post,
  // this function will be called again. The problem is that the params.id
  // field will point to an invalid id
  // Need to send a signal back to the component that the blog is already
  // deleted and it should Navigate the user to a different page.

  try {
    const response = await api.get("/blogposts/" + id);
    //    console.log(
    //      "blogPostsLoader> response.data: " + JSON.stringify(response.data)
    //    );
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
