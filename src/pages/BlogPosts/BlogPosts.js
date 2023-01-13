import { useLoaderData, Link } from "react-router-dom";

import api from "../../api/posts";

/*
const fetchPosts = async () => {
  console.log("fetchPosts()");
  try {
    const response = await api.get("/blogposts");
    const blogPosts = response.data;
    console.log("BlogPosts> blogPosts: " + blogPosts);

    return blogPosts;
  } catch (err) {
    console.log("fetchPosts> err: " + err.toString());
  }
};

export default function BlogPosts() {
  console.log("BlogPosts");
  const blogPosts = fetchPosts();
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
*/

export default function BlogPosts() {
  // Retrieve the pre-loaded database data
  // This will invoke the below blogPostLoader as assigned in App.js
  const blogPosts = Array.from(useLoaderData());
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
  try {
    const response = await api.get("/blogposts");
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
  /*  const res = await fetch("http://localhost:4000/blogposts");
  if (!res.ok) {
    throw Error("Could not fetch the blog posts");
  }

  return res.json();
  */
};
