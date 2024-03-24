import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    
    useEffect(() => {
        fetch('http://127.0.0.1:5000/profile', {
            credentials: 'include',
        })
        .then(res => {
            res.json().then(userInfo => {
                console.log("User info:", userInfo);
                setUserInfo(userInfo);
                setIsLoading(false); // Update loading state after fetch completes
            });
        })
        .catch(error => {
            console.error("Fetch error:", error);
            setIsLoading(false); // Update loading state in case of error
        });
    }, []);

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo, isLoading }}>
            {children}
        </UserContext.Provider>
    );
}