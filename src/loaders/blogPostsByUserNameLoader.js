import api from "../api/axios";

const API_BASE_URL = "/blogposts/byusername/"; // :userName

/**
 * Load all blog posts for a given user.
 * @param {userName} param0
 * @returns
 */
export const blogPostsByUserNameLoader = async ({ params }) => {
  const userName = params.userName;
  console.log(
    "blogPostsByUserNameLoader> Loading blog posts for userName: " + userName
  );
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
  try {
    const fullURL = API_BASE_URL + userName;
    console.log("getBlogPostsByUserName> fulLURL: " + fullURL);
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
    //      "blogPostsByUserNameLoader> response.data: " + JSON.stringify(response.data)
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
      console.log(`blogPostsByUserNameLoader> Error: ${err.message}`);
    }
  }
};