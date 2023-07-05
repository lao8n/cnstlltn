import { useEffect, useContext } from "react";
import UserContext from "../components/userContext";
import { useNavigate } from 'react-router-dom';
import { withApplicationInsights } from "../components/telemetry";

export const LoginRedirect = () => {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        setUser(prevUser => ({
            ...prevUser,
            userId: prevUser?.userId ?? '',
            isAuthenticated: true,
        }));
        navigate('/constellation');
    }, [setUser, navigate]);
    
    return null;
};

export default withApplicationInsights(LoginRedirect, 'LoginRedirect');