import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:4000",
});

export async function getNextID() {
  console.log("getNextID");
  try {
    const response = await axios.get("/blogposts");
    //    console.log(
    //      "blogPostsLengthLoader> response.data: " + JSON.stringify(response.data) );
    const blogPosts = response.data;
    const nextID = blogPosts.length
      ? blogPosts[blogPosts.length - 1].id + 1
      : 1;
    console.log(
      "getNextID> blogPosts.length: " + blogPosts.length + ", nextID: " + nextID
    );
    return nextID;
  } catch (err) {
    if (err.response) {
      // Not in the 200 response range
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
    } else {
      // No response or non-200 error
      console.log(`getNextID> Error: ${err.message}`);
    }
  }
}
