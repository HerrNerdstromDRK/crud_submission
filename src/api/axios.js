import axios from "axios";

// TODO: Move this to dotenv
const PORT = process.emitWarning.PORT || 4000;
export default axios.create({
  baseURL: "http://127.0.0.1:" + PORT,
  //  baseURL: "http://localhost:8080",
});
