import { createRoot } from "react-dom/client"
// import "./index.css" // Global styles for the application
import App from "./App" // Main application component
import { AuthContextProvider } from './context/AuthContext' // Context provider for user authentication
import { SessionContextProvider } from './context/SessionContext' // Context provider for session management

/**
 * Entry point of the application.
 * Renders the React application into the root element.
 * 
 * @returns {void}
 */
const rootElement = document.getElementById("root")

if (rootElement) {
  const root = createRoot(rootElement);

  /**
   * Render the application within the React.StrictMode for development checks.
   * Provides context providers for authentication and session management.
   */
  root.render(
    <SessionContextProvider>
      {/* Provides authentication context to the application */}
      <AuthContextProvider>
        <App /> {/* Main application component */}
      </AuthContextProvider>
    </SessionContextProvider>
  );
} else {
  console.error("Root element not found");
}