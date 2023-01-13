import { useLoaderData /*useParams*/ } from "react-router-dom";
import api from "../../api/posts";

export default function BlogPost() {
  //  const { id } = useParams();
  const theBlogPost = useLoaderData();

  return (
    <div className="blogpost-details">
      <h2>Blog post details for {theBlogPost.title}</h2>
      <p>Staring salary: {theBlogPost.salary}</p>
      <p>Location: {theBlogPost.location}</p>
      <div className="details">
        <p>Some blog post information here.</p>
      </div>
    </div>
  );
}

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
    if (err.response) {
      // Not in the 200 response range
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
    } else {
      // No response or non-200 error
      console.log(`blogPostsLoader> Error: ${err.message}`);
    }
  }
  /*
  const res = await fetch("http://localhost:4000/blogposts/" + id);
  if (!res.ok) {
    throw Error("Could not find blog post with id " + id);
  }
  return res.json();
  */
};
