import React from "react";

import { Form, redirect, useActionData } from "react-router-dom";

export default function CreatePost() {
  // The useActionData() hook allows us access to the return data
  // from the createPostAction() below.
  // We can use it to inform any form updates/responses here.
  const data = useActionData();
  return (
    <div className="contact">
      <h3>Create Post</h3>
      <Form method="post" action="/createpost">
        <label>
          <span>Blog Title:</span>
          <input type="message" name="title" required />
        </label>
        <label>
          <span>Your post:</span>
          <textarea type="message" name="postcontent" required></textarea>
        </label>
        <button>Submit</button>
        {/* Check if the data from the contactAction() below returned an error
          If so, show the user. */}
        {data && data.error && <p>{data.error}</p>}
      </Form>
    </div>
  );
}

// request contains all form data (all input values from above)
export const createPostAction = async ({ request }) => {
  //  console.log(request);

  const data = await request.formData();
  const newPostData = {
    title: data.get("title"),
    postcontent: data.get("postcontent"),
  };
  console.log("contactAction> newPostData: " + JSON.stringify(newPostData));

  // TODO: Send post request here (save to db)

  // Validate the input
  /*  if (newPostData.message.length < 10) {
    return { error: "Message must be at least 10 characters long" };
  }
  if (!submission.email.indexOf(".") < 0) {
    // Email missing '.' for TLD
    return { error: "Invalid email address." };
  }
*/
  // redirect the user
  return redirect("/");
};
