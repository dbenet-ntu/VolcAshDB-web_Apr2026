import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useSessionContext } from './useSessionContext';
import axios from "axios";
import * as constants from '../Constants';

export const useSSOToken = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();
    const { sessionId } = useSessionContext();
    const proxy = constants.PROXY;
    
    const getToken = async (code, state) => {
        setError(null);
        setIsLoading(true);
        
        try {

            if (!sessionId) {
                setIsLoading(false);
                return;
            }

            const keycloak_callback = localStorage.getItem(`kc-callback-${state}`);

            const pkceCodeVerifier = JSON.parse(keycloak_callback).pkceCodeVerifier;

            // Make an AJAX request to the backend to exchange the authorization code for an access token
            const response = await axios.post(`${proxy}/SSO/get_token`, { code, pkceCodeVerifier, sessionId });

            if (response.status != 200) {
                // Handle error if the response status is not OK
                setError(response.statusText);
            } else {

                const user = response.data;

                // Save user data to local storage on successful login
                localStorage.setItem('user', JSON.stringify(user));

                // Update the auth context with the logged-in user's data
                dispatch({ type: 'LOGIN', payload: user });
            }

        } catch (err) {
            setError("An error occurred during token exchange: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return { getToken, isLoading, error };
};
