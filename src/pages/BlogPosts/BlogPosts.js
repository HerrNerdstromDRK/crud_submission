import React from "react";
import { useLoaderData, useNavigation, Link } from "react-router-dom";

import api from "../../api/axios";
const API_BASE_URL = "/blogposts";
const API_BASE_URL_BY_USER = "/blogposts/myitems";

export default function BlogPosts() {
  // Retrieve the pre-loaded database data
  // This will invoke the below blogPostLoader as assigned in App.js
  const blogPosts = useLoaderData();
  const navigation = useNavigation();

  //  console.log("BlogPosts> blogPosts: " + JSON.stringify(blogPosts));
  // The proper method to handle slow loader functions is with Response/Await
  // I was able to get it working, but it became noisy when there were no
  // delays. Go figure.
  if (navigation.state === "Loading") {
    return <h1> Loading... </h1>;
  }
  return (
    <div className="blogposts">
      {blogPosts.map((blogPosts) => (
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
      ))}
    </div>
  );
}

// Loader function
export const blogPostsLoader =
  ({ userName }) =>
  async () => {
    console.log(
      "blogPostsLoader> Loading blog posts for userName: " + userName
    );
    try {
      let url = API_BASE_URL;
      if (userName !== "*") {
        // Retrieve blog posts for a single user
        url = API_BASE_URL_BY_USER + "/" + userName;
      }
      console.log("blogPostsLoader> url: " + url);
      /*
      const response = await api.post(
        LOGIN_URL,
        JSON.stringify({ userName, pwd }),
        {
          headers: { "Content-Type": "application/json" },
          //          withCredentials: true,
        }
      );
      
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

      */
      const response = await api.get(url, {
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
      //      "blogPostsLoader> response.data: " + JSON.stringify(response.data)
      //    );
      //    return defer({ blogPosts: responsePromise });
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
