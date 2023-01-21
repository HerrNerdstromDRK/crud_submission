import api from "../api/axios";

const API_BASE_URL = "/inventoryitems/byusername/";

/**
 * Load all inventory items for a given user.
 * @param {userName} param0
 * @returns
 */
export const inventoryItemsByUserNameLoader = async ({ params }) => {
  const userName = params.userName;
  //  console.log(
  //    "inventoryItemsByUserNameLoader> Loading inventory items for userName: " +
  //      userName
  //  );

  try {
    const fullURL = API_BASE_URL + userName;
    //    console.log("inventoryItemsByUserNameLoader> fullURL: " + fullURL);
    const response = await api.get(fullURL, {
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
    //      "inventoryItemsByUserNameLoader> response.data: " + JSON.stringify(response.data)
    //    );
    return response.data;
  } catch (err) {
    if (err.response) {
      // Not in the 200 response range
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
    } else {
      // No response or non-200 error
      console.log(`inventoryItemsByUserNameLoader> Error: ${err.message}`);
    }
  }
  return [];
};
