import { useLoaderData, Link } from "react-router-dom";

export default function BlogPosts() {
  // Retrieve the pre-loaded database data
  // This will invoke the below blogPostLoader as assigned in App.js
  const blogPosts = useLoaderData();
  return (
    <div className="blogposts">
      {blogPosts.map((blogPosts) => (
        <Link to={blogPosts.id.toString()} key={blogPosts.id}>
          <p>Title: {blogPosts.title}</p>
          <p>Location: {blogPosts.location}</p>
        </Link>
      ))}
    </div>
  );
}

// Loader function
export const blogPostsLoader = async () => {
  const res = await fetch("http://localhost:4000/blogposts");
  if (!res.ok) {
    throw Error("Could not fetch the blog posts");
  }
  return res.json();
};
