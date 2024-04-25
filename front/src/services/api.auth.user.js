import { baseUrl } from "./axios.config";

// User registration and forgot password
export const createUser = (data) => baseUrl.post("/user/", data);
export const forgotPassword = (data) => baseUrl.post("/user/forgot-password/", data);