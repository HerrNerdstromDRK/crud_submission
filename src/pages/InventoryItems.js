import React from "react";
import { useLoaderData, useNavigation, Link } from "react-router-dom";

export default function InventoryItems() {
  // Retrieve the pre-loaded database data
  // This will invoke the imported inventoryItemLoader as assigned in App.js
  const inventoryItems = useLoaderData();
  const navigation = useNavigation();

  //  console.log("InventoryItems> inventoryItems: " + JSON.stringify(inventoryItems));
  // The proper method to handle slow loader functions is with Response/Await
  // I was able to get it working, but it became noisy when there were no
  // delays. Go figure.
  if (navigation.state === "Loading") {
    return <h1> Loading... </h1>;
  }
  return (
    <div className="inventoryitems">
      {inventoryItems.map((inventoryItems) => (
        <Link
          to={"/inventoryitem/" + inventoryItems._id.toString()}
          key={inventoryItems._id}
        >
          <p>Owner: {inventoryItems.owner}</p>
          <p>Item Name: {inventoryItems.itemname}</p>
          <p>Quantity: {inventoryItems.quantity}</p>
          <p>Date Modified: {inventoryItems.modifieddate}</p>
          <p>
            {inventoryItems.description.length > 100
              ? inventoryItems.description.substring(0, 99) + "..."
              : inventoryItems.description}
          </p>
        </Link>
      ))}
    </div>
  );
}
