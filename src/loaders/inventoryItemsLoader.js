import api from "../api/axios";

const API_BASE_URL = "/inventoryitems";

/**
 * Load all inventory items.
 * @param {none} param0
 * @returns
 */
export const inventoryItemsLoader = async () => {
  //  console.log("inventoryItemsLoader> Loading all inventory items");

  try {
    const response = await api.get(API_BASE_URL, {
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
    //      "inventoryItemsLoader> response.data: " + JSON.stringify(response.data)
    //    );
    //    return defer({ inventoryItems: responsePromise });
    return response.data;
  } catch (err) {
    if (err.response) {
      // Not in the 200 response range
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
    } else {
      // No response or non-200 error
      console.log(`inventoryItemsLoader> Error: ${err.message}`);
    }
  }
  return [];
};
