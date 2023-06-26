import { FC, PropsWithChildren, ReactElement, useEffect, useState } from 'react';
import UserContext from './userContext';
import { AppContext } from '../models/applicationState';
import { getDefaultState } from '../models/applicationState';

type UserProps = PropsWithChildren<unknown>;

const initialState = getDefaultState();

export const UserProvider: FC<UserProps> = (props: UserProps): ReactElement => {
    const [user, setUser] = useState(initialState.userState);
  
    // Fetch user data when component mounts
    useEffect(() => {
      console.log("useEffect called");
      if(user?.isAuthenticated){
        fetch(`/.auth/me`)
        .then(response => response.json())
        .then(response => {
          console.log("auth me called - here is response", response);
          if (response.clientPrincipal){
            console.log("user id", response.clientPrincipal.userId);
            setUser(prevUser => ({
              ...prevUser,
              userId: response.clientPrincipal.userId, 
              isAuthenticated: true,
            }));
          }
        })
        .catch(error => console.log(error));
      }
    }, [user?.isAuthenticated]);

    const userContext : AppContext = { 
      state: { userState: user },
      setUser
    }
    console.log("userContext", userContext);
    return (
        <UserContext.Provider value={ userContext }>
            {props.children}
        </UserContext.Provider>
    );
}

export default UserProvider