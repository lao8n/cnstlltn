import { useEffect, useState } from 'react';
import { Stack, Text } from '@fluentui/react';
import { withApplicationInsights } from '../components/telemetry';
import { User } from '../models/userState';

const Constellation = () => {
    const [user, setUser] = useState<User | null>(null);

    // Get user id
    useEffect(() => {
        fetch(`/.auth/me`)
            .then(response => response.json())
            .then(response => {
                if (response.clientPrincipal){
                    setUser(response.clientPrincipal.userDetails)
                }
            })
            .catch(error => console.log(error));
    }, [user]);

    if(!user){
        return (
            <Stack>
                <Text>Login to access constellation</Text>
            </Stack>
        );
    }

    return (
        <Stack>
            <Text>Welcome {user.userDetails}</Text>
        </Stack >
    );
};

export default withApplicationInsights(Constellation, 'Constellation');