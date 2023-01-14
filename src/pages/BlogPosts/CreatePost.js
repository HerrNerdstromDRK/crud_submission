import React from "react";

import { Form, redirect, useActionData } from "react-router-dom";
import api from "../../api/posts";

export default function CreatePost() {
  // The useActionData() hook allows us access to the return data
  // from the createPostAction() below.
  // We can use it to inform any form updates/responses here.
  const data = useActionData();
  return (
    <div className="contact">
      <h3>Create Blog Post</h3>
      <Form method="post" action="/createpost">
        <label>
          <span>Title:</span>
          <input type="message" name="title" required />
        </label>
        <label>
          <span>Your post:</span>
          <textarea type="message" name="content" required></textarea>
        </label>
        <button>Create Post</button>
        {/* Check if the data from the createPostAction() below returned an error
          If so, show the user. */}
        {data && data.error && <p>{data.error}</p>}
      </Form>
    </div>
  );
}

// request contains all form data (all input values from above)
export const createPostAction = async ({ request }) => {
  //  console.log(request);
  try {
    // First, get a new ID
    // TOOD: This is grossly inefficient and not in the spirit of javascript/react dev
    const getResponse = await api.get("/blogposts");
    //    console.log(
    //      "blogPostsLengthLoader> response.data: " + JSON.stringify(response.data) );
    const blogPosts = getResponse.data;
    //    const nextID = blogPosts.length
    //      ? blogPosts[blogPosts.length - 1].id + 1
    //      : 1;
    //    console.log(
    //      "createPostAction> blogPosts.length: " + blogPosts.length + ", nextID: " + nextID
    //    );

    // Build the new blog post
    const data = await request.formData();
    const newPost = {
      //    id: nextID,
      author: "Unknown author",
      modifieddate: new Date().toLocaleString(),
      title: data.get("title"),
      content: data.get("content"),
    };
    //    console.log("contactAction> newPostData: " + JSON.stringify(newPost));

    // Next, submit the new post
    await api.post("/blogposts", newPost);
  } catch (err) {
    if (err.response) {
      // Not in the 200 response range
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
    } else {
      // No response or non-200 error
      console.log(`createPostAction> Error: ${err.message}`);
    }
  }

  // redirect the user
  return redirect("/blogposts");
};
