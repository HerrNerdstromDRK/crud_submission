import { Form, redirect, useActionData } from "react-router-dom";

export default function Contact() {
  // The useActionData() hook allows us access to the return data
  // from the contactAction() below.
  // We can use it to inform any form updats/responses here.
  const data = useActionData();
  return (
    <div className="contact">
      <h3>Contact Us</h3>
      <Form method="post" action="/help/contact">
        <label>
          <span>Your email:</span>
          <input type="email" name="email" required />
        </label>
        <label>
          <span>Your message:</span>
          <textarea name="message" required></textarea>
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
export const contactAction = async ({ request }) => {
  //  console.log(request);

  const data = await request.formData();
  const submission = {
    email: data.get("email"),
    message: data.get("message"),
  };
  console.log("contactAction> submission: " + JSON.stringify(submission));

  // Send post request here (save to db)

  // Validate the input
  if (submission.message.length < 10) {
    return { error: "Message must be at least 10 characters long" };
  }
  if (!submission.email.indexOf(".") < 0) {
    // Email missing '.' for TLD
    return { error: "Invalid email address." };
  }

  // redirect the user
  return redirect("/");
};
