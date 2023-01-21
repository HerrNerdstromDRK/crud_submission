import { Link, useRouteError } from "react-router-dom";

/**
 * errorElement to show an error with retrieving the inventory item.
 * @returns
 */
export default function InventoryItemError() {
  const error = useRouteError();
  console.log(error);

  return (
    <div className="inventoryitem-error">
      <h2>Error</h2>
      <p>{error.data}</p>
      <Link to="/">Back to homepage</Link>
    </div>
  );
}
