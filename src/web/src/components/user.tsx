import { FC, PropsWithChildren, ReactElement, useEffect, useState } from 'react';
import UserContext from './userContext';
import { AppContext } from '../models/applicationState';
import { UserState } from '../models/userState';

type UserProps = PropsWithChildren<unknown>;

export const UserProvider: FC<UserProps> = (props: UserProps): ReactElement => {
  const [userState, setUser] = useState<UserState | undefined>(undefined);  // Initialize state here
  
  useEffect(() => {
      if(userState?.isAuthenticated){
          fetch(`/.auth/me`)
          .then(response => response.json())
          .then(response => {
              if (response.clientPrincipal){
                  setUser(prevUser => ({
                      ...prevUser,
                      userId: response.clientPrincipal.userId, 
                      isAuthenticated: true,
                  }));
              }
          })
          .catch(error => console.log(error));
      }
  }, [userState?.isAuthenticated]);

    const userContext : AppContext = { 
      state: { userState },
      setUser
    }
    return (
        <UserContext.Provider value={ userContext }>
            {props.children}
        </UserContext.Provider>
    );
}
export default UserProvider