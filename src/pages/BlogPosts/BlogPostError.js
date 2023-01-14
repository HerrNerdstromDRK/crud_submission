import { Link, useRouteError } from "react-router-dom";

export default function BlogPostError() {
  const error = useRouteError();

  return (
    <div className="blogpost-error">
      <h2>Error</h2>
      <p>{error.data}</p>
      <Link to="/">Back to homepage</Link>
    </div>
  );
}
