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
        fetch(`/.auth/me`)
          .then(response => response.json())
          .then(response => {
              if (response.clientPrincipal) {
                  setUser(prevUser => ({
                      ...prevUser,
                      userId: response.clientPrincipal.userId, 
                      isAuthenticated: true,
                  }));
                  trackEvent(ActionTypes.LOGIN_REDIRECT_SET_USER.toString());
                  navigate('/constellation');
              }
          })
          .catch(error => {
              console.error('Error during authentication:', error);
              navigate('/login')
              // Handle error, maybe navigate to an error page or show a message
          });
    }, [setUser, navigate]);
    
    return null;
};

export default withApplicationInsights(LoginRedirect, 'LoginRedirect');