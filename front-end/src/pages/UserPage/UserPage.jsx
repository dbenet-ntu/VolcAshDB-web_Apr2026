import { useState } from "react";
import { Container, Form, Title, FormContent, Select, Input, SubmitButton, Success, Error } from './UserPage.styles';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useUpdateInformation } from '../../hooks/useUpdateInformation';
import countries from 'i18n-iso-countries';
import en from "i18n-iso-countries/langs/en.json";
countries.registerLocale(en);


/**
 * UserPage: Component for displaying and updating user account information.
 * Utilizes hooks for authentication and updating user information.
 * 
 * @returns {JSX.Element} - The rendered UserPage component.
 */
const UserPage = () => {
    // Extract user data from authentication context
    const { user } = useAuthContext();
    
    // State to manage email, country, and institute fields
    const [email, setEmail] = useState(user.email);
    const [country, setCountry] = useState(user.country || '');
    const [institute, setInstitute] = useState(user.institute || 'University/Institute');
    
    // Custom hook for updating user information
    const { updateInformation, isLoading, success, message } = useUpdateInformation();

    /**
     * Handles form submission to update user information.
     * 
     * @param {object} e - The submit event object.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Prepare the fields to be updated
        const updateFields = { email };
        if (country) updateFields.country = country;
        if (institute) updateFields.institute = institute;

        await updateInformation(updateFields);
    };

    /**
     * Handles changes to the country select field.
     * 
     * @param {object} e - The change event object.
     */
    const handleCountryChange = (e) => {
        setCountry(e.target.value);
    };

    /**
     * Handles changes to the institute input field.
     * 
     * @param {object} e - The change event object.
     */
    const handleInstituteChange = (e) => {
        setInstitute(e.target.value);
    };

    return (
        <Container>
            {/* Form for updating user account information */}
            <Form onSubmit={handleSubmit}>

                <Title>User account</Title>

                {/* Email input field */}
                <FormContent>Email:
                    <Input
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        disabled
                    />
                </FormContent>
                
                {/* Country select field */}
                <FormContent>Country:
                    <Select
                        value={country}
                        onChange={handleCountryChange}
                    >
                        <option value="">Select Country</option>
                        {Object.entries(countries.getNames("en")).map(([code, name]) => (
                            <option key={code} value={code}>{name}</option>
                        ))}
                    </Select>
                </FormContent>

                {/* Institute input field */}
                <FormContent>Institute:
                    <Input
                        type="text"
                        onChange={handleInstituteChange}
                        value={institute}
                    />
                </FormContent>

                {/* Submit button */}
                <SubmitButton type="submit" variant="contained" disabled={isLoading}>Submit</SubmitButton>

                {/* Display message based on the success of the update */}
                {message && success && <Success>{message}</Success>}
                {message && !success && <Error>{message}</Error>}
            
            </Form>
        </Container>
    );
};

export default UserPage;