import React from "react";
import { useLoaderData, useNavigation, Link } from "react-router-dom";

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
        <Link to={"/blogpost/" + blogPosts._id.toString()} key={blogPosts._id}>
          <p>Title: {blogPosts.title}</p>
          <p>Author: {blogPosts.author}</p>
          <p>Date Modified: {blogPosts.modifieddate}</p>
          <p>
            {blogPosts.content.length > 100
              ? blogPosts.content.substring(0, 99) + "..."
              : blogPosts.content}
          </p>
        </Link>
      ))}
    </div>
  );
}
