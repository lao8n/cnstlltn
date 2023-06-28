import { useEffect, useContext } from "react";
import UserContext from "../components/userContext";
import { useNavigate } from 'react-router-dom';

export const LoginRedirect = () => {
    const { state, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        setUser(prevUser => ({
            ...prevUser, 
            userId: prevUser?.userId,
            isAuthenticated: true}));
    }, [setUser]);

    useEffect(() => {
        if (state.userState?.isAuthenticated) {
            navigate('/constellation');
        }
    }, [state.userState?.userId , navigate]);

    return null;
};