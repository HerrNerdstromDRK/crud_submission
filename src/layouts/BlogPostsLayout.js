import { Outlet } from "react-router-dom";

export default function BlogPostsLayout() {
  return (
    <div className="blogposts-layout">
      <h2>BlogPosts</h2>
      <p>BlogPosts latin stuff here</p>
      <Outlet />
    </div>
  );
}
