import { useState } from "react";
import { useVerifyCode } from "../../hooks/useVerifyCode";  // Custom hook for verification
import { useAuthContext } from '../../hooks/useAuthContext';

import { Container, FormAuth, TitleForm, ContentForm, InputForm, ButtonForm, ErrorForm } from './Authentication.styles';

/**
 * VerifyCode Component: Provides a form for users to enter a verification code to verify their email address.
 * 
 * @returns {JSX.Element} The rendered component.
 */
const VerifyCode = () => {
    // Retrieve the current authenticated user from context
    const { user } = useAuthContext();

    // State to manage the verification code input
    const [code, setCode] = useState('');

    // Hook to handle verification logic
    const { verify, error, isLoading } = useVerifyCode();

    /**
     * Handles form submission for verifying the code.
     * 
     * @param {React.FormEvent<HTMLFormElement>} e - The form event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        if (!user || !user.email) {
            return;
        }

        // Call the verify function with the user's email and the provided code
        await verify(user.email, code);
    };

    return (
        <Container>
            <FormAuth onSubmit={handleSubmit}>
                <TitleForm>Verify Your Email</TitleForm>

                <ContentForm>Verification Code:
                    <InputForm
                        type="text"
                        onChange={(e) => setCode(e.target.value)} // Update code state
                        value={code}
                    />
                </ContentForm>

                <ButtonForm type="submit" variant="contained" disabled={isLoading}>Verify</ButtonForm>
                {error && <ErrorForm>{error}</ErrorForm>} {/* Display error message if present */}
            </FormAuth>
        </Container>
    );
};

export default VerifyCode;
