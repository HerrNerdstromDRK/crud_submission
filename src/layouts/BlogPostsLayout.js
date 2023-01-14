import { Outlet } from "react-router-dom";

export default function BlogPostsLayout() {
  return (
    <div className="blogposts-layout">
      <Outlet />
    </div>
  );
}
