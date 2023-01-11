import { useLoaderData /*useParams*/ } from "react-router-dom";

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
  const res = await fetch("http://localhost:4000/blogposts/" + id);
  if (!res.ok) {
    throw Error("Could not find blog post with id " + id);
  }
  return res.json();
};
