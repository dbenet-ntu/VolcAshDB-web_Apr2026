import { useState, useEffect } from "react";
import { useLogin } from '../../hooks/useLogin';
import { useSSOLogin } from '../../hooks/useSSOLogin';
import { useSSOToken } from '../../hooks/useSSOToken';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate, useLocation } from 'react-router';
import { Container, FormAuth, TitleForm, ContentForm, InputForm, IconForm, ButtonForm, ForgotPasswordForm, ErrorForm, SSOButton } from './Authentication.styles';

/**
 * Login Component: Provides a form for user login with email and password.
 * 
 * @returns {JSX.Element} The rendered component.
 */
const Login = () => {
    // State to manage email input
    const [email, setEmail] = useState('');
    
    // State to manage password input
    const [password, setPassword] = useState('');
    
    // State to toggle password visibility
    const [showPassword, setShowPassword] = useState(false);

    //State to manage code has been received from Keycloak
    const [codeReceived, setCodeReceived] = useState(false);


    // Hook to handle login logic
    const { login, error, isLoading } = useLogin();
    
    const { login: ssoLogin, isLoading: isSSOLoginLoading, error: ssoLoginError } = useSSOLogin();

    const { getToken, isLoading: isSSOGetTokenLoading, error: ssoGetTokenError } = useSSOToken();


    // Hook for navigation
    const navigate = useNavigate();
    const location = useLocation();

    // Extract the authorization code from the URL
    useEffect(() => {
        const urlParams = new URLSearchParams(location.hash);
        const code = urlParams.get('code');
        const state = urlParams.get('#state');

        if (code != null && state != null && !isSSOGetTokenLoading) {
            if (code.length > 0 && state.length > 0) {
                setCodeReceived(true);
                getToken(code, state);
            }
        }
    }, [location.search, getToken, isSSOGetTokenLoading]);

    /**
     * Handles form submission for user login.
     * 
     * @param {React.FormEvent<HTMLFormElement>} e - The form event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        await login(email, password); // Call the login function with email and password

    };

    const handleSSOLogin = async () => {
        await ssoLogin();  // Trigger SSO login via Keycloak
    };

    return (
        <Container>
            <FormAuth onSubmit={handleSubmit}>
                
                <TitleForm>Log in</TitleForm>

                <ContentForm>Email:
                    <InputForm
                        type="email"
                        onChange={(e) => setEmail(e.target.value)} 
                        value={email} 
                        required
                    />
                </ContentForm>

                <ContentForm>Password:
                    <InputForm 
                        type={showPassword ? "text" : "password"} // Toggle input type based on showPassword state
                        onChange={(e) => setPassword(e.target.value)} 
                        value={password} 
                        required
                    />
                    <IconForm 
                        onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                    >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconForm>
                </ContentForm>

                <ButtonForm type="submit" variant="contained" disabled={isLoading}>Log in</ButtonForm>

                {error && <ErrorForm>{error}</ErrorForm>} {/* Display error message if present */}

                <ForgotPasswordForm>
                    <ButtonForm onClick={() => navigate('/forget')}>Forgot Password?</ButtonForm> {/* Navigate to forget password page */}
                </ForgotPasswordForm>

                <SSOButton type="button" variant="contained" onClick={handleSSOLogin} disabled={isSSOLoginLoading}>
                    {isSSOLoginLoading || isSSOGetTokenLoading ? 'Redirecting to SSO...' : 'Login with SSO'}
                </SSOButton>

                {ssoLoginError && <ErrorForm>{ssoLoginError}</ErrorForm>} {/* Display error message if present */}
                {ssoGetTokenError && <ErrorForm>{ssoGetTokenError}</ErrorForm>} {/* Display error message if present */}

            </FormAuth>
        </Container>
    );
};

export default Login;