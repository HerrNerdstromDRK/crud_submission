import {
  Form,
  redirect,
  useLoaderData,
  useActionData,
  Navigate,
} from "react-router-dom";

import api from "../../api/axios";
import "../../App.css";
import useAuth from "../../hooks/useAuth";

// blogAuthor is used to track the author between loader/render/action
let blogAuthor = null;
let editModeEnabled = false;

export default function BlogPost() {
  // useLoaderData() will return the data retrieved from the below loader
  // function.
  const theBlogPost = useLoaderData();
  //  console.log("BlogPost> theBlogPost: " + JSON.stringify(theBlogPost));

  // Since this is a form that can potentially have many cycles of
  // loader/render/action, catch any messages from the action function here
  const actionMessageObject = useActionData();
  const actionMessage = actionMessageObject?.message
    ? actionMessageObject.message
    : "";

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
      {actionMessage ? actionMessage : ""}
      <h2>Blog post details for {theBlogPost.title}</h2>
      <p>Author: {theBlogPost.author}</p>
      <p>Date Modified: {theBlogPost.modifieddate}</p>

      <div className="details">
        <Form method={editModeEnabled ? "POST" : "PUT"}>
          <label>
            <span>Title:</span>
            <input
              type="message"
              name="title"
              defaultValue={theBlogPost.title}
              disabled={!editModeEnabled}
            />
          </label>
          <label>
            <span>Content:</span>
            <textarea
              type="message"
              rows="4"
              cols="50"
              name="content"
              defaultValue={
                !auth?.userName && theBlogPost.content.length > 100
                  ? theBlogPost.content.substring(0, 99) + "..."
                  : theBlogPost.content
              }
              disabled={!editModeEnabled}
            />
          </label>
          {auth?.userName && auth.userName === theBlogPost.author ? (
            <button type="submit">
              {editModeEnabled ? "Update Post" : "Edit Post"}
            </button>
          ) : (
            ""
          )}
        </Form>
      </div>

      <div>
        {auth?.userName && auth.userName === theBlogPost.author ? (
          <>
            <Form method="DELETE">
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
  //  const formData = await request.formData();
  const { id } = params;

  switch (request.method) {
    case "POST": {
      // POST means update post (save to the backend)
      //      console.log("blogPostButtonHandler> Caught POST; saving to backend");
      // Disable edit mode
      editModeEnabled = false;

      // Return the message from the action function
      return updateBlogPost({ request, params });
      // No redirect -- re-render the page
    }
    case "PUT": {
      // PUT means enable edit mode
      //      console.log("blogPostButtonHandler> PUT id: " + id);
      //      console.log("blogPostHandler> Caught PUT; enabling edit mode");
      editModeEnabled = true;
      return { message: "Edit mode enabled" };
    }
    case "DELETE": {
      // DELETE means delete the post
      //  form validation of an authenticated user.
      //console.log("blogPostButtonHandler.delete> DELETE id: " + id);
      deleteBlogPost(id);
      if (blogAuthor != null) {
        // Successfully deleted the blogPost and returned the owning userName
        //  console.log("blogPostButtonHandler.delete> Redirecting to blogposts");
        return redirect("/blogposts/" + blogAuthor);
      } else {
        console.log("blogPostButtonHandler> DELETE: No user found");
        return redirect("/");
      }
    }
    default: {
      // Either failed to delete blogPost or failed to find/return the owning
      console.log(
        "blogPostButtonHandler> No matching request.method: " + request.method
      );
      return { message: "Invalid request method for blog post" };
    }
  }
};

/**
 * Save an item to the backend.
 * @param {*} formData
 * @returns
 */
const updateBlogPost = async ({ request, params }) => {
  console.log("updateBlogPost");
  const formData = await request.formData();
  const { id } = params;
  const updatedTitle = formData.get("title");
  const updatedContent = formData.get("content");
  /*
  console.log(
    "updateBlogPost> id: " +
      id +
      ", updatedTitle: " +
      updatedTitle +
      ", updatedContent: " +
      updatedContent
  );
  */
  try {
    // Create the new form of the object, updating only those items that change
    const updatedPost = {
      modifieddate: new Date().toLocaleString(),
      title: updatedTitle,
      content: updatedContent,
    };
    //    console.log("updateBlogPost> updatedPost: " + JSON.stringify(updatedPost));

    // Next, submit the new post
    await api.patch(`/blogposts/${id}`, updatedPost);
  } catch (err) {
    if (err.response) {
      // Not in the 200 response range
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
      return { message: "Error: " + err.message };
    } else {
      // No response or non-200 error
      console.log(`updateBlogPost> Error: ${err.message}`);
    }
  }
  return { message: "Successfully updated!" };
};

const deleteBlogPost = async (id) => {
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
