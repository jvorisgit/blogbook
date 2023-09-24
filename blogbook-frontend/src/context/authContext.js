import { createContext, useState, useEffect } from "react";
import axios from "axios";

//use local browser storage to maintain authentication context
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

    const login = async(inputs) => {
        try {
            const loginRes = await axios.post("/auth/login", inputs);
            setCurrentUser(loginRes.data);
        }
        catch (err) {
            console.log(err);
        }
    }

    const logout = async(inputs) => {
        try {
            await axios.post("auth/logout");
        }
        catch (err) {
            console.log(err);
        }
        setCurrentUser(null);
    }

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{currentUser, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};
