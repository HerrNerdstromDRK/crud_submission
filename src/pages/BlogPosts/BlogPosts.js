import { useLoaderData, Link } from "react-router-dom";

import api from "../../api/posts";

export default function BlogPosts() {
  // Retrieve the pre-loaded database data
  // This will invoke the below blogPostLoader as assigned in App.js
  const blogPosts = useLoaderData();

  return (
    <div className="blogposts">
      {blogPosts.map((blogPosts) => (
        <Link to={blogPosts.id.toString()} key={blogPosts.id}>
          <p>Title: {blogPosts.title}</p>
          <p>Author: {blogPosts.author}</p>
          <p>Date Modified: {blogPosts.datemodified}</p>
          <p>
            {blogPosts.content.length > 199
              ? blogPosts.content.substring(0, 198)
              : blogPosts.content}
          </p>
        </Link>
      ))}
    </div>
  );
}

// Loader function
export const blogPostsLoader = async () => {
  try {
    const response = await api.get("/blogposts", {
      // query URL without using browser cache
      // For some reason, the app is not retrieving the full list of items
      // after a delete, despite the item just deleted no longer being resident
      // in the backend database
      params: { timestamp: Date.now() },
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
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
};
