import { baseUrl } from "./axios.config";


// Authentication
export const getToken = (data) => baseUrl.post("/token/", data);
export const refreshToken = (data) => baseUrl.post("/token/refresh/", data);
