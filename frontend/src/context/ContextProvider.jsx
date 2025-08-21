import React, {  useState, useEffect, createContext } from 'react';
import { jwtDecode } from 'jwt-decode';

export const UserContext = createContext();

const ContextProvider = ({ children }) => {
    const [user, setUser] = useState({ role: null, authenticated: false });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUser({
                    role: decodedToken.role,
                    authenticated: true
                });
                console.log("tgjuk");
                
            } catch (error) {
                console.error("Invalid token found:", error);
                setUser({ role: null, authenticated: false });
            }
        }

        setLoading(false);
    }, []);

    if (loading) {       
        return <div>Loading...</div>;
    }

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
};

export default ContextProvider;