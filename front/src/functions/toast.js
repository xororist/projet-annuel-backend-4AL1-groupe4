import { toast } from 'react-toastify';


const config = {
    position: "top-right",
    autoClose: false,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
}


export const notifySuccess = (message) => toast.success(message, config);

export const notifyError = (message) => toast.error(message, config);

export const notifyWarning = (message) => toast.warning(message, config);


