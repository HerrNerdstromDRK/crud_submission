import { Form, Link, redirect, useLoaderData } from "react-router-dom";

import api from "../../api/posts";
import "../../App.css";

export default function BlogPost() {
  const theBlogPost = useLoaderData();

  return (
    <div className="blogpost-details">
      <h2>Blog post details for {theBlogPost.title}</h2>
      <p>Author: {theBlogPost.author}</p>
      <p>Date Modified: {theBlogPost.datemodified}</p>

      <div className="details">
        <p>Content: {theBlogPost.content}</p>
      </div>
      <div>
        <Link to={`/updatepost/${theBlogPost.id}`}>
          <button>Update Post</button>
        </Link>
        <Form method="delete">
          <button type="submit">Delete Post</button>
        </Form>
      </div>
    </div>
  );
}

export const blogPostButtonHandler = async ({ request, params }) => {
  //  const data = await request.formData();
  const { id } = params;

  switch (request.method) {
    /*  case "PUT": {
      //      console.log("blogPostButtonHandler> PUT id: " + id);
      return redirect("/updatepost/" + id);
    }*/
    case "DELETE": {
      //console.log("blogPostButtonHandler> DELETE id: " + id);
      deleteBlogPost(id);
      return redirect("/blogposts");
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
    //const response =
    await api.delete(`/blogposts/${id}`);
    //    console.log(
    //      "deleteBlogPost> response.data: " + JSON.stringify(response.data) );
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
  //  console.log("deleteBlogPost> Redirecting to blogposts");
  return redirect("/blogposts");
};

// Loader function
export const blogPostLoader = async ({ params }) => {
  // Destructure id from the parameters
  const { id } = params;
  try {
    const response = await api.get("/blogposts/" + id);
    //    console.log(
    //      "blogPostsLoader> response.data: " + JSON.stringify(response.data) );
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
