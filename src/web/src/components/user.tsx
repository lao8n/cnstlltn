import { FC, PropsWithChildren, ReactElement, useEffect, useContext } from 'react';
import UserContext from './userContext';
import { AppContext } from '../models/applicationState';

type UserProps = PropsWithChildren<unknown>;

export const UserProvider: FC<UserProps> = (props: UserProps): ReactElement => {
  const { state, setUser } = useContext(UserContext);
  
    useEffect(() => {
      if(state.userState?.isAuthenticated){
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
  }, [state, setUser]);

    const userContext : AppContext = { 
      state: { userState: state.userState },
      setUser
    }
    return (
        <UserContext.Provider value={ userContext }>
            {props.children}
        </UserContext.Provider>
    );
}

export default UserProvider