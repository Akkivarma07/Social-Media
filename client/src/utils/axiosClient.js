import axios from "axios";
import {
  KEY_ACCESS_TOKEN,
  getItem,
  removetItem,
  setItem,
} from "./localStorageManager";

export const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_SERVER_BASE_URL,
  withCredentials: true,
});

axiosClient.interceptors.request.use(async (request) => {
  const accessToken = getItem(KEY_ACCESS_TOKEN);
  request.headers["Authorization"] = `Bearer ${accessToken}`;
  return request;
});

axiosClient.interceptors.response.use(async (response) => {
  const data = response.data;
  if (data.status === "ok") {
    return data;
  }

  const originalRequest = response.config;
  const statusCode = data.statusCode;
  const error = data.error;

  if (
    statusCode === 401 &&
    originalRequest.url === `${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`
  ) {
    removetItem(KEY_ACCESS_TOKEN);
    window.location.replace("/login", "_self");
    return Promise.reject(error);
  }
  if (statusCode === 401) {
    const response = await axiosClient.get("/auth/refresh");
    console.log("response from backend ", response);
    if (response.status === "ok") {
      setItem(KEY_ACCESS_TOKEN, response.result.accessToken);
      originalRequest.headers[
        "Authorization"
      ] = `Bearer ${response.result.accessToken}`;
      return axios(originalRequest);
    }
  }
  return Promise.reject(error);
});
