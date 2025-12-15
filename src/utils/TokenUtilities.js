const ACCESS_TOKEN_KEY = "accessToken";
const USER_ROLE_KEY = "userRole";   
const USER_DATA_KEY = "userData";  

const saveSession = (token, role, user) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    localStorage.setItem(USER_ROLE_KEY, role);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user || {}));
};

const clearSession = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_ROLE_KEY);
    localStorage.removeItem(USER_DATA_KEY);
};

const getAccessToken = () => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
};

const getUserRole = () => {
    return localStorage.getItem(USER_ROLE_KEY);
};

const getUserData = () => {
    const raw = localStorage.getItem(USER_DATA_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
};

const isAuthenticated = () => {
    return !!getAccessToken();
};

export {
    saveSession,
    clearSession,
    getAccessToken,
    getUserRole,
    getUserData,
    isAuthenticated
};
