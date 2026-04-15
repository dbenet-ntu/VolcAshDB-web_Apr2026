import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import Keycloak from 'keycloak-js';  // Import Keycloak

export const useSSOLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();

    // Initialize Keycloak instance
    const keycloak = new Keycloak({
        url: "https://sso.aeris-data.fr/auth",
        realm: "formater",
        clientId: "volcash-db"
    });

    const login = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            // Redirect to Keycloak login page
            await keycloak.init({ onLoad: 'login-required', checkLoginIframe: false})
            .then(authenticated => {

                if (authenticated) {

                    const user = {
                        email: keycloak.tokenParsed.email,
                        token: keycloak.id_token,
                    };

                    // Save user data to local storage
                    localStorage.setItem('user', JSON.stringify(user));

                    // Update auth context with Keycloak user profile
                    dispatch({ type: 'LOGIN', payload: user });
                } else {
                    keycloak.login()
                }
            })
            .catch(err => {
                setError("An error occurred during SSO login: "+err.error);
            })
            .finally(() => setIsLoading(false));

        } catch (err) {
            setError('Failed to login via SSO: ' + err.error);
        } finally {
            setIsLoading(false);
        }
    };

    return { login, isLoading, error };
};
