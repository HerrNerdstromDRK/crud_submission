import axios from "axios";

// TODO: Move this to dotenv
export default axios.create({
  baseURL: "http://127.0.0.1:4000",
  //  baseURL: "http://localhost:8080",
});
