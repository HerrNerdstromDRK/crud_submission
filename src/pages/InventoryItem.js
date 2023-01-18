import {
  Form,
  redirect,
  useLoaderData,
  useActionData,
  Navigate,
} from "react-router-dom";

import api from "../api/axios";
import "../App.css";
import useAuth from "../hooks/useAuth";

// itemAuthor is used to track the owner between loader/render/action
let itemAuthor = null;
let editModeEnabled = false;

export default function InventoryItem() {
  // useLoaderData() will return the data retrieved from the below loader
  // function.
  const theInventoryItem = useLoaderData();
  //  console.log("InventoryItem> theInventoryItem: " + JSON.stringify(theInventoryItem));

  // Since this is a form that can potentially have many cycles of
  // loader/render/action, catch any messages from the action function here
  const actionMessageObject = useActionData();
  const actionMessage = actionMessageObject?.message
    ? actionMessageObject.message
    : "";

  if (null == itemAuthor && theInventoryItem != null) {
    // Record the userName when this page first loads.
    // That way, if the item is deleted, and theInventoryItem information
    // is therefore lost, we can still redirect the user to the items
    // owned by the owner of the original post.
    itemAuthor = theInventoryItem.owner;
    //    console.log("InventoryItem> Caught owner: " + itemAuthor);
  }
  // Check if the user is logged in
  const { auth } = useAuth();
  //                 !/[0-9\x7F\x08\u2190]/.test(e.key) && e.preventDefault()

  if (null == theInventoryItem) {
    // No inventoryItem found
    // Could be that the form and below action have already executed and
    // deleted the inventoryItem.
    return <Navigate to={"/inventoryitems/" + itemAuthor} replace />;
  }

  return (
    <div className="inventoryitem-details">
      {actionMessage ? actionMessage : ""}
      <h2>Inventory Item details for {theInventoryItem.itemname}</h2>
      <p>Author: {theInventoryItem.owner}</p>
      <p>Date Modified: {theInventoryItem.modifieddate}</p>

      <div className="details">
        <Form method={editModeEnabled ? "POST" : "PUT"}>
          <label>
            <span>Item Name:</span>
            <input
              type="message"
              name="itemname"
              defaultValue={theInventoryItem.itemname}
              disabled={!editModeEnabled}
            />
          </label>
          <label>
            <span>Item Quantity:</span>
            <input
              type="number"
              name="quantity"
              min="0"
              step="1"
              defaultValue={theInventoryItem.quantity}
              disabled={!editModeEnabled}
              onKeyDown={(e) =>
                !/[0-9\x7F\u2190]/.test(e.key) && e.preventDefault()
              }
            />
            {/* TODO: number validation */}
          </label>
          <label>
            <span>Description:</span>
            <textarea
              type="message"
              rows="4"
              cols="50"
              name="description"
              defaultValue={
                !auth?.userName && theInventoryItem.description.length > 100
                  ? theInventoryItem.description.substring(0, 99) + "..."
                  : theInventoryItem.description
              }
              disabled={!editModeEnabled}
            />
          </label>
          {auth?.userName && auth.userName === theInventoryItem.owner ? (
            <button type="submit">
              {editModeEnabled ? "Update Item" : "Edit Item"}
            </button>
          ) : (
            ""
          )}
        </Form>
      </div>

      <div>
        {auth?.userName && auth.userName === theInventoryItem.owner ? (
          <>
            <Form method="DELETE">
              <button type="submit">Delete Item</button>
            </Form>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export const inventoryItemButtonHandler = async ({ request, params }) => {
  //  const formData = await request.formData();
  const { id } = params;

  switch (request.method) {
    case "POST": {
      // POST means update post (save to the backend)
      //      console.log("inventoryItemButtonHandler> Caught POST; saving to backend");
      // Disable edit mode
      editModeEnabled = false;

      // Return the message from the action function
      return updateInventoryItem({ request, params });
      // No redirect -- re-render the page
    }
    case "PUT": {
      // PUT means enable edit mode
      //      console.log("inventoryItemButtonHandler> PUT id: " + id);
      //      console.log("inventoryItemHandler> Caught PUT; enabling edit mode");
      editModeEnabled = true;
      return { message: "Edit mode enabled" };
    }
    case "DELETE": {
      // DELETE means delete the post
      //  form validation of an authenticated user.
      //console.log("inventoryItemButtonHandler.delete> DELETE id: " + id);
      deleteInventoryItem(id);
      if (itemAuthor != null) {
        // Successfully deleted the inventoryItem and returned the owning userName
        //  console.log("inventoryItemButtonHandler.delete> Redirecting to blogposts");
        return redirect("/blogposts/" + itemAuthor);
      } else {
        console.log("inventoryItemButtonHandler> DELETE: No user found");
        return redirect("/");
      }
    }
    default: {
      // Either failed to delete inventoryItem or failed to find/return the owning
      console.log(
        "inventoryItemButtonHandler> No matching request.method: " +
          request.method
      );
      return { message: "Invalid request method for blog post" };
    }
  }
};

/**
 * Save an item to the backend.
 * @param {*} formData
 * @returns
 */
const updateInventoryItem = async ({ request, params }) => {
  console.log("updateInventoryItem");
  const formData = await request.formData();
  const { id } = params;
  const updatedItemName = formData.get("itemname");
  const updatedDescription = formData.get("description");
  const updatedQuantity = formData.get("quantity");
  /*
  console.log(
    "updateInventoryItem> id: " +
      id +
      ", updatedItemName: " +
      updatedItemName +
      ", updatedDescription: " +
      updatedDescription +
      ", updatedQuantity: " + updatedQuantity
  );
  */
  try {
    // Create the new form of the object, updating only those items that change
    const updatedItem = {
      modifieddate: new Date().toLocaleString(),
      itemname: updatedItemName,
      description: updatedDescription,
      quantity: updatedQuantity,
    };
    //    console.log("updateInventoryItem> updatedItem: " + JSON.stringify(updatedPost));

    // Next, submit the updated item
    await api.patch(`/inventoryitems/${id}`, updatedItem);
  } catch (err) {
    if (err.response) {
      // Not in the 200 response range
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
      return { message: "Error: " + err.message };
    } else {
      // No response or non-200 error
      console.log(`updateInventoryItem> Error: ${err.message}`);
    }
  }
  return { message: "Successfully updated!" };
};

const deleteInventoryItem = async (id) => {
  //  console.log("deleteInventoryItem> Deleting blog id: " + id);
  try {
    await api.delete("/inventoryitems/" + id);
  } catch (err) {
    if (err.response) {
      // Not in the 200 response range
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
    } else {
      // No response or non-200 error
      console.log(`deleteInventoryItem> Error: ${err.message}`);
    }
  }
  // Navigation/redirection is handled in the component or inventoryItemButtonHandler
};

// Loader function
export const inventoryItemLoader = async ({ params }) => {
  // Destructure id from the parameters
  const { id } = params;

  //  console.log("inventoryItemLoader> id: " + id);

  // Once the code above is invoked, specifically to delete the inventoryItem,
  // this function will be called again. The problem is that the params.id
  // field will point to an invalid id.
  // Need to send a signal back to the component that the item is already
  // deleted and it should Navigate the user to a different page.

  try {
    const response = await api.get("/inventoryitems/" + id);
    //    console.log(
    //      "inventoryItemsLoader> response.data: " + JSON.stringify(response.data)
    //    );
    if (!response?.data) {
      // No inventoryItem found, return null data to communicate to the Component
      // that no item exists
      //      console.log("inventoryItemLoader> Found null inventoryItem: " + id);
      response.data = null;
    }
    return response.data;
  } catch (err) {
    console.log(
      "inventoryItemLoader> data: " + JSON.stringify(err.response.data)
    );
    console.log("inventoryItemLoader> status: " + err.response.status);
    if (err.response.status === 404) {
      // inventoryItem not found.
      console.log("inventoryItemLoader> Found 404, throwing exception");
      throw new Response("inventoryItem ID not found", { status: 404 });
    } else if (err.response) {
      // Not in the 200 response range
      console.log("inventoryItemLoader> Error status: " + err.response.status);
      console.log(
        "inventoryItemLoader> Error data: " + JSON.stringify(err.response.data)
      );
      //      console.log(err.response.headers);
    } else {
      // No response or non-200 error
      console.log(`inventoryItemsLoader> Error: ${err.message}`);
    }
  }
  return [];
};
