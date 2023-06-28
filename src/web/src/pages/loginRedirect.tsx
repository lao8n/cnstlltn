import { useEffect, useContext } from "react";
import UserContext from "../components/userContext";
import { useNavigate } from 'react-router-dom';

export const LoginRedirect = () => {
    const { setUser, user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        setUser(prevUser => ({
            ...prevUser, 
            userId: prevUser?.userId,
            isAuthenticated: true}));
    }, [setUser]);

    useEffect(() => {
        if (user.isAuthenticated) {
            navigate('/constellation');
        }
    }, [user, navigate]);

    return null;
};