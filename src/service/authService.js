import axios from "axios";

const BASE_URL = "http://localhost:3000";

const loginOwner = (loginData) => {
    return new Promise((resolve, reject) => {
        axios.post(`${BASE_URL}/auth/clientlogin`, loginData)
            .then((response) => {
                resolve(response.data);   
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
};

const loginWalker = (loginData) => {
    return new Promise((resolve, reject) => {
        axios.post(`${BASE_URL}/auth/walkerlogin`, loginData)
            .then((response) => {
                resolve(response.data);   
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
};

const registerOwner = (data) => {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("password", data.password);
        if (data.photoFile) {
            formData.append("PhotoProfile", data.photoFile);
        }

        axios.post(`${BASE_URL}/auth/clientregister`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
            .then((response) => resolve(response.data))
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
};

const registerWalker = (data) => {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("password", data.password);
        if (data.priceHour) {
            formData.append("priceHour", data.priceHour);
        }
        if (data.photoFile) {
            formData.append("PhotoProfile", data.photoFile);
        }

        axios.post(`${BASE_URL}/auth/walkerregister`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
            .then((response) => resolve(response.data))
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
};

export {
    loginOwner,
    loginWalker,
    registerOwner,
    registerWalker
};
