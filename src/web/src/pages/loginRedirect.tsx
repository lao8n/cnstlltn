import { useEffect, useContext } from "react";
import UserAppContext from "../components/userContext";
import { useNavigate } from 'react-router-dom';
import { withApplicationInsights } from "../components/telemetry";
import { ActionTypes } from "../actions/common";

export const LoginRedirect = () => {
    const { dispatch } = useContext(UserAppContext);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch({
            type: ActionTypes.SET_USER,
            payload: {
                isLoggedIn: true,
            },
        });
        navigate('/constellation');
    }, [dispatch, navigate]);
    
    return null;
};

export default withApplicationInsights(LoginRedirect, 'LoginRedirect');