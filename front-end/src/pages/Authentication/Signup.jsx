import { useState } from "react";
import { Container, FormAuth, TitleForm, ContentForm, InputForm, SelectForm, IconForm, ButtonForm, ErrorForm } from './Authentication.styles';
import { useSignup } from '../../hooks/useSignup';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import countries from 'i18n-iso-countries';
import en from "i18n-iso-countries/langs/en.json";
countries.registerLocale(en);


/**
 * Signup Component: Provides a form for users to sign up with their email, password, country, and institute information.
 * 
 * @returns {JSX.Element} The rendered component.
 */
const Signup = () => {
    // State to manage the email input
    const [email, setEmail] = useState('');
    
    // State to manage the password input
    const [password, setPassword] = useState('');
    
    // State to manage the password confirmation input
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // State to manage the selected country
    const [country, setCountry] = useState('');
    
    // State to manage the institute input
    const [institute, setInstitute] = useState('University/Institute');
    
    // Hook to handle signup logic
    const { signup, error, isLoading } = useSignup();
    
    // State to toggle visibility of the password input
    const [showPassword, setShowPassword] = useState(false);
    
    // State to toggle visibility of the confirm password input
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    /**
     * Handles form submission for signing up.
     * 
     * @param {React.FormEvent<HTMLFormElement>} e - The form event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Call the signup function with email, password, confirmation password, country, and institute
        await signup(email, password, confirmPassword, country, institute);
    };

    /**
     * Handles changes to the country select input.
     * 
     * @param {React.ChangeEvent<HTMLSelectElement>} e - The change event.
     */
    const handleCountryChange = (e) => {
        setCountry(e.target.value); // Update state with selected country
    };

    /**
     * Handles changes to the institute input.
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
     */
    const handleInstituteChange = (e) => {
        setInstitute(e.target.value); // Update state with institute value
    };

    return (
        <Container>
            <FormAuth onSubmit={handleSubmit}>

                <TitleForm>Sign Up</TitleForm>

                <ContentForm>Email:
                    <InputForm
                        type="email"
                        onChange={(e) => setEmail(e.target.value)} // Update email state
                        value={email}
                    />
                </ContentForm>
                
                <ContentForm>Password:
                    <InputForm 
                        type={showPassword ? "text" : "password"} // Toggle input type based on showPassword state
                        onChange={(e) => setPassword(e.target.value)} // Update password state
                        value={password}
                    />
                    <IconForm onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconForm>
                </ContentForm>

                <ContentForm>Confirm Password:
                    <InputForm 
                        type={showConfirmPassword ? "text" : "password"} // Toggle input type based on showConfirmPassword state
                        onChange={(e) => setConfirmPassword(e.target.value)} // Update confirm password state
                        value={confirmPassword}
                    />
                    <IconForm onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconForm>
                </ContentForm>

                <hr style={{width: '80%', margin: '20px'}} /> {/* Divider for visual separation */}

                <ContentForm>Country:
                    <SelectForm
                        value={country}
                        onChange={handleCountryChange} // Update country state
                    >
                        <option value="">Select Country</option>
                        {Object.entries(countries.getNames("en")).map(([code, name]) => (
                            (<option key={code} value={code}>{name}</option>) // Render country options
                        ))}
                    </SelectForm>
                </ContentForm>

                <ContentForm>Institute:
                    <InputForm
                        type="text"
                        onChange={handleInstituteChange} // Update institute state
                        value={institute}
                    />
                </ContentForm>

                <ButtonForm type="submit" variant="contained" disabled={isLoading}>Sign up</ButtonForm>
                {error && <ErrorForm>{error}</ErrorForm>} {/* Display error message if present */}

            </FormAuth>
        </Container>
    );
};

export default Signup;