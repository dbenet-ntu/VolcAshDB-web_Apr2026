import { useState } from "react";
import { useForgetPassword } from '../../hooks/useForgetPassword';
import { Container, FormAuth, TitleForm, ContentForm, InputForm, ButtonForm, SuccessForm, ErrorForm } from './Authentication.styles';


/**
 * ForgetPassword Component: Renders a form for users to request a password reset.
 * 
 * @returns {JSX.Element} The rendered component.
 */
const ForgetPassword = () => {
    // State to manage the email input value
    const [email, setEmail] = useState('');

    // Hook to handle the forget password logic
    const { forgetPassword, isLoading, message, success } = useForgetPassword();

    /**
     * Handles form submission to request a password reset.
     * 
     * @param {React.FormEvent<HTMLFormElement>} e - The form event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        await forgetPassword(email); // Call the forgetPassword function with the email
    };

    return (
        <Container>
            <FormAuth onSubmit={handleSubmit}>
                <TitleForm>Forget Password</TitleForm>

                <ContentForm>Email:
                    <InputForm 
                        type="email" 
                        onChange={(e) => setEmail(e.target.value)} 
                        value={email} 
                        required
                    />
                </ContentForm>

                <ButtonForm type="submit" variant="contained" disabled={isLoading}>Send Reset Link</ButtonForm>
                
                {/* Display message if available, with conditional styling based on success */}
                {message && success && <SuccessForm>{message}</SuccessForm>}
                {message && !success && <ErrorForm>{message}</ErrorForm>}
            </FormAuth>
        </Container>
    );
};

export default ForgetPassword;
