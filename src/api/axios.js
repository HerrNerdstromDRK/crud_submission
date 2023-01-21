import axios from "axios";
//require("dotenv").config();

const BACKEND_BASE_URL = "https://karrels-crud-submission-api.onrender.com";
const BACKEND_BASE_PORT = 8888;

export default axios.create({
  baseURL: BACKEND_BASE_URL, // + ":" + BACKEND_BASE_PORT,
});
