import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginOwner, loginWalker } from "../service/authService";
import {
    saveSession,
    clearSession,
    isAuthenticated,
    getUserRole,
    getUserData
} from "../utils/TokenUtilities";


const useAuthentication = (requireAuth = true, role = "owner") => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (requireAuth) {
            if (!isAuthenticated()) {
                if (role === "walker") {
                    navigate("/login-walker");
                } else {
                    navigate("/login-owner");
                }
            }
        }
    }, [requireAuth, role, navigate]);

    const doLogin = (loginData) => {
        setLoading(true);

        const loginFn = role === "walker" ? loginWalker : loginOwner;

        return loginFn(loginData)
            .then((data) => {
                if (role === "walker") {
                    saveSession(data.token, "walker", data.walker);
                    navigate("/walker/home");
                } else {
                    saveSession(data.token, "owner", data.owner);
                    navigate("/owner/home");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const logout = () => {
        clearSession();
        navigate("/login-owner");
    };

    const currentRole = getUserRole();
    const currentUser = getUserData();

    return {
        loading,
        doLogin,
        logout,
        role: currentRole,
        user: currentUser
    };
};

export default useAuthentication;
