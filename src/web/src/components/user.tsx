import { FC, PropsWithChildren, ReactElement, useState } from 'react';
import UserContext from './userContext';
import { AppContext } from '../models/applicationState';
import { UserState } from '../models/userState';

type UserProps = PropsWithChildren<unknown>;

export const UserProvider: FC<UserProps> = (props: UserProps): ReactElement => {
  const [userState, setUser] = useState<UserState | undefined>(undefined);  // Initialize state here
  
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