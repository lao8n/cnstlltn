import { useEffect, useContext } from "react";
import UserContext from "../components/userContext";
import { useNavigate } from 'react-router-dom';
import { trackEvent } from "../services/telemetryService";
import { ActionTypes } from "../actions/common";
import { withApplicationInsights } from "../components/telemetry";

export const LoginRedirect = () => {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAuthInfo = async () => {
            const requestOptions = {
                method: 'GET',
                headers: headers,
                'credentials': 'same-origin'  //credentials go here!!!
            };
            const clientPrincipal = await getAuthInfo();
            console.log(clientPrincipal);
            if (clientPrincipal && clientPrincipal.userId) {
                setUser(prevUser => ({
                    ...prevUser,
                    userId: clientPrincipal.userId, 
                    isAuthenticated: true,
                }));
                trackEvent(ActionTypes.LOGIN_REDIRECT_SET_USER.toString());
                navigate('/constellation');
            } else {
                console.error('Error during authentication:');
                navigate('/login');
            }
        };
        fetchAuthInfo();
    }, [setUser, navigate]);
    
    return null;
};

async function getAuthInfo() {  
    const headers = {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    };
    const requestOptions = {
        method: 'GET',
        headers: headers,
        credentials: 'same-origin' as RequestCredentials
    };
    // call the endpoint  
    const response = await fetch('/.auth/me', requestOptions);  
    // convert to JSON  
    const json = await response.json();  
    // ensure clientPrincipal  exist  
    if(json.clientPrincipal) {  
        return json.clientPrincipal;  
    } else {  
        // return null if anonymous  
        return null;  
    }  
}  

export default withApplicationInsights(LoginRedirect, 'LoginRedirect');