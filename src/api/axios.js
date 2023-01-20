import axios from "axios";

const PORT = 8888;
export default axios.create({
  baseURL: "http://127.0.0.1:" + PORT,
  //  baseURL: "http://localhost:8080",
});
