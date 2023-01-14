import React from "react";
import { Form, redirect, useLoaderData } from "react-router-dom";
import api from "../../api/posts";

export default function UpdatePost() {
  // The useActionData() hook allows us access to the return data
  // from the updatePostAction() below.
  // We can use it to inform any form updates/responses here.
  const data = useLoaderData();
  return (
    <div className="contact">
      <h3>Update Blog Post</h3>
      <Form method="post" action={"/updatepost/" + data._id.toString()}>
        <label>
          <span>New title:</span>
          <input type="text" name="title" required defaultValue={data.title} />
        </label>
        <label>
          <span>New content:</span>
          <textarea
            type="text"
            name="content"
            required
            defaultValue={data.content}
          ></textarea>
        </label>
        <button>Update Post</button>
        {/* Check if the data from the createPostAction() below returned an error
          If so, show the user. */}
        {data && data.error && <p>{data.error}</p>}
      </Form>
    </div>
  );
}

export const updatePostLoader = async ({ params }) => {
  // Destructure id from the parameters
  const { id } = params;
  try {
    const response = await api.get("/blogposts/" + id);
    //    console.log(
    //      "updatePostLoader> response.data: " + JSON.stringify(response.data)
    //    );
    return response.data;
  } catch (err) {
    console.log("updatePostLoader> data: " + JSON.stringify(err.response.data));
    console.log("updatePostLoader> status: " + err.response.status);
    if (err.response.status === 404) {
      // Blog post not found.
      console.log("updatePostLoader> Found 404, throwing exception");
      throw new Response("Blog post ID not found", { status: 404 });
    } else if (err.response) {
      // Not in the 200 response range
      console.log("updatePostLoader> Error status: " + err.response.status);
      console.log(
        "updatePostLoader> Error data: " + JSON.stringify(err.response.data)
      );
      //      console.log(err.response.headers);
    } else {
      // No response or non-200 error
      console.log(`updatePostLoader> Error: ${err.message}`);
    }
  }
  return [];
};

export const updatePostAction = async ({ request, params }) => {
  const data = await request.formData();
  const { id } = params;
  //  console.log("updatePostaction> params: " + JSON.stringify(params));
  const editTitle = data.get("title");
  const editContent = data.get("content");
  /*  console.log(
    "updatePostaction> id: " +
      id +
      ", editTitle: " +
      editTitle +
      ", editContent: " +
      editContent
  );
*/

  try {
    // Create the new form of the object, updating only those items that change
    const updatedPost = {
      modifieddate: new Date().toLocaleString(),
      title: editTitle,
      content: editContent,
    };
    //    console.log(
    //      "updatePostLoader> updatedPost: " + JSON.stringify(updatedPost)
    //    );

    // Next, submit the new post
    await api.patch(`/blogposts/${id}`, updatedPost);
  } catch (err) {
    if (err.response) {
      // Not in the 200 response range
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
    } else {
      // No response or non-200 error
      console.log(`updatePostAction> Error: ${err.message}`);
    }
  }

  // redirect the user
  return redirect("/blogposts");
};
