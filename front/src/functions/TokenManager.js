import { jwtDecode } from "jwt-decode";


const checkTokenExpiration = () => {
    const token = localStorage.getItem("token") || "";
    if (!token) {
        return true;
    }

    const decodedToken = jwtDecode(token);
    const expirationDate = new Date(decodedToken.exp * 1000);
    const currentDate = new Date();

    return currentDate > expirationDate;
}


const isAuthenticated = () => {
    if (checkTokenExpiration()) {
        return false;
    } else {
        return true;
    }
};

export default isAuthenticated