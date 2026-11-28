import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.PROD ? "/api" : "http://localhost:5000/api",
  withCredentials: true, // lets the browser store and send the cookie
});