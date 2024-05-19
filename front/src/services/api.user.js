import { baseUrl } from "./axios.config";

baseUrl.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export const currentUser = (data) => baseUrl.get("/user/me/");
export const getUserInformation = (idUser) => baseUrl.get(`/user/informations/${idUser}/`);
export const updateUserInformation = (idUser, user) => baseUrl.put(`/user/update/${idUser}/`, user);

