import { useState, useEffect } from "react";
import { Container, Form, FormContent, Title, Select, SubmitButton, Success, Error, Input } from './SettingsPage.styles';
import { useUpdateInformation } from '../../hooks/useUpdateInformation';
import useFetchRoles from '../../hooks/useFetchRoles';

/**
 * SettingsPage: Component for managing user roles and settings.
 * Utilizes hooks for updating information and fetching user roles, and provides a form for role management.
 * 
 * @returns {JSX.Element} - The rendered SettingsPage component.
 */
const SettingsPage = () => {
    // State to store user roles and search term
    const [userRoles, setUserRoles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Custom hooks for updating user information and fetching roles
    const { updateInformation, isLoading, success, message } = useUpdateInformation();
    const { fetchRoles, result } = useFetchRoles();

    useEffect(() => {
        // Fetch roles if result is empty
        if (result.length < 0) {
            fetchRoles();
        }
    }, [result, fetchRoles]);

    useEffect(() => {
        // Update user roles state when result changes
        if (result.length > 0) {
            setUserRoles(result.map(user => ({ email: user.email, role: user.role })));
        }
    }, [result]);

    /**
     * Handles form submission by updating each user's role.
     * 
     * @param {object} e - The submit event object.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        await Promise.all(userRoles.map(async userRole => {
            const updateFields = { email: userRole.email, role: userRole.role };
            await updateInformation(updateFields);
        }));
    };

    /**
     * Handles changes to a user's role.
     * 
     * @param {string} email - The email of the user whose role is changing.
     * @param {string} role - The new role to assign to the user.
     */
    const handleRoleChange = (email, role) => {
        setUserRoles(userRoles.map(userRole =>
            userRole.email === email ? { email: email, role: role } : userRole
        ));
    };

    /**
     * Handles changes to the search input field.
     * 
     * @param {object} e - The change event object.
     */
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filter user roles based on the search term
    const filteredUserRoles = userRoles.filter(userRole =>
        userRole.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container>
            {/* Form for managing user roles */}
            <Form onSubmit={handleSubmit}>
                <Title>Settings Menu</Title>
                
                {/* Search input for filtering users by email */}
                <Input
                    type="text"
                    placeholder="Search by email"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />

                {/* List of user roles with role selection */}
                {filteredUserRoles.map((userRole) => (
                    <FormContent key={userRole.email}>
                        <Input
                            type="email"
                            value={userRole.email}
                            disabled
                        />
                        <Select
                            value={userRole.role}
                            onChange={(e) => handleRoleChange(userRole.email, e.target.value)}
                        >
                            <option value="user">User</option>
                            <option value="annotator">Annotator</option>
                            <option value="team member">Team Member</option>
                            <option value="admin">Admin</option>
                        </Select>
                    </FormContent>
                ))}
                
                {/* Submit button for saving changes */}
                <SubmitButton variant="contained" disabled={isLoading}>Submit</SubmitButton>
                
                {/* Display message based on the success of the update */}
                {message && success && <Success>{message}</Success>}
                {message && !success && <Error>{message}</Error>}
            </Form>
        </Container>
    );
};

export default SettingsPage;
