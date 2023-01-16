import React from "react";
import { Await, useLoaderData, defer, Link } from "react-router-dom";

import api from "../../api/axios";

export default function BlogPosts() {
  // Retrieve the pre-loaded database data
  // This will invoke the below blogPostLoader as assigned in App.js
  const data = useLoaderData();
  //  console.log("BlogPosts> data: " + JSON.stringify(data));

  return (
    <div className="blogposts">
      <React.Suspense fallback={<p>Loading data...</p>}>
        <Await
          resolve={data.blogPosts}
          errorElement={<p>Error loading blog posts!</p>}
        >
          {(blogPosts) =>
            blogPosts.data.map((blogPosts) => (
              <Link to={blogPosts._id.toString()} key={blogPosts._id}>
                <p>Title: {blogPosts.title}</p>
                <p>Author: {blogPosts.author}</p>
                <p>Date Modified: {blogPosts.modifieddate}</p>
                <p>
                  {blogPosts.content.length > 199
                    ? blogPosts.content.substring(0, 198)
                    : blogPosts.content}
                </p>
              </Link>
            ))
          }
        </Await>
      </React.Suspense>
    </div>
  );
}

/*            <div>
              <p>blogPosts.data.length: {blogPosts.data.length}</p>
              <p>
                JSON.stringify(blogPosts.data.):{" "}
                {JSON.stringify(blogPosts.data)}
              </p>
            </div>
            
          {blogPosts.map((blogPost) => (
            <p>Title: {blogPost.title}</p>
          ))}
          
          <div>
            {" "}
            <p>blogPosts.data.length: {blogPosts.data.length}</p>
            <p>
              JSON.stringify(blogPosts.data.): {JSON.stringify(blogPosts.data)}
            </p>
          </div>
                    )}

{data.blogPosts.map((blogPosts) => (
  <Link to={blogPosts.id.toString()} key={blogPosts.id}>
    <p>Title: {blogPosts.title}</p>
    <p>Author: {blogPosts.author}</p>
    <p>Date Modified: {blogPosts.modifieddate}</p>
    <p>
      {blogPosts.content.length > 199
        ? blogPosts.content.substring(0, 198)
        : blogPosts.content}
    </p>
  </Link>
))})}
*/

// Loader function
export const blogPostsLoader = async () => {
  try {
    // TODO: await
    const responsePromise = api.get("/blogposts", {
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
    return defer({ blogPosts: responsePromise });
    //response.data;
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
