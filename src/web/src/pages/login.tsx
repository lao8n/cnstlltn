import { BaseButton, Stack } from '@fluentui/react';
import { withApplicationInsights } from '../components/telemetry';

const Login = () => {
    return (
        <Stack>
            <Stack.Item> Login into cnstlltn </Stack.Item>
            <Stack.Item>
                <BaseButton href="/.auth/login/google" >Login with Google</BaseButton>
                <BaseButton href="/.auth/login/google?post_login_redirect_uri=/constellation" >Login with Google</BaseButton>
            </Stack.Item>
        </Stack>
    );
};

export default withApplicationInsights(Login, 'Login');