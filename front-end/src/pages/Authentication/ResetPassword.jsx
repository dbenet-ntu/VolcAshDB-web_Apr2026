import { useState } from "react";
import { useParams } from "react-router";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useResetPassword } from "../../hooks/useResetPassword";

import { Container, FormAuth, TitleForm, ContentForm, InputForm, IconForm, ButtonForm, SuccessForm, ErrorForm } from './Authentication.styles';

/**
 * ResetPassword Component: Provides a form to reset the user's password using a token from the URL.
 * 
 * @returns {JSX.Element} The rendered component.
 */
const ResetPassword = () => {
    // State to manage the new password input
    const [password, setPassword] = useState('');
    
    // State to manage the password confirmation input
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Extract the reset token from the URL parameters
    const { token } = useParams();
    
    // Hook to handle the password reset logic
    const { resetPassword, isLoading, success, message } = useResetPassword();
    
    // State to toggle visibility of the new password input
    const [showPassword, setShowPassword] = useState(false);
    
    // State to toggle visibility of the confirm password input
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    /**
     * Handles form submission for resetting the password.
     * 
     * @param {React.FormEvent<HTMLFormElement>} e - The form event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Call the resetPassword function with the token, new password, and confirmation password
        await resetPassword(token, password, confirmPassword);
    };

    return (
        <Container>
            <FormAuth onSubmit={handleSubmit}>
                
                <TitleForm>Reset Password</TitleForm>

                <ContentForm>New Password:
                    <InputForm
                        type={showPassword ? "text" : "password"} // Toggle input type based on showPassword state
                        onChange={(e) => setPassword(e.target.value)} 
                        value={password} 
                        required
                    />
                    <IconForm onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconForm>
                </ContentForm>

                <ContentForm>Confirm Password:
                    <InputForm
                        type={showConfirmPassword ? "text" : "password"} // Toggle input type based on showConfirmPassword state
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        value={confirmPassword} 
                        required
                    />
                    <IconForm onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconForm>
                </ContentForm>

                <ButtonForm type="submit" variant="contained"  disabled={isLoading}>Reset Password</ButtonForm>

                {message && success && <SuccessForm>{message}</SuccessForm>}
                {message && !success && <ErrorForm>{message}</ErrorForm>}
            </FormAuth>
        </Container>
    );
};

export default ResetPassword;
