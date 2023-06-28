import { useEffect, useContext } from "react";
import UserContext from "../components/userContext";
import { useNavigate } from 'react-router-dom';
import { trackEvent } from "../services/telemetryService";
import { ActionTypes } from "../actions/common";

export const LoginRedirect = () => {
    const { state, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        setUser(prevUser => ({
            ...prevUser, 
            userId: prevUser?.userId,
            isAuthenticated: true
        }));
        trackEvent(ActionTypes.LOGIN_REDIRECT_SET_USER.toString());
        if (state.userState?.isAuthenticated) {
            trackEvent(ActionTypes.LOGIN_REDIRECT_LINK.toString());
            navigate('/constellation');
        }
    }, [setUser, state.userState?.userId, navigate]);

    return null;
};