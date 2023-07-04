import { Stack, BaseButton } from '@fluentui/react';
import { withApplicationInsights } from '../components/telemetry';

const Login = () => {
    return (
        <Stack verticalAlign="center" horizontalAlign="center">
                        <Stack.Item> Login into cnstlltn </Stack.Item>
        <Stack.Item>
          <Stack horizontalAlign="center" tokens={{ childrenGap: 10 }}>
            <Stack>
              <BaseButton href={`/.auth/login/google?post_login_redirect_uri=/login-redirect&time=` + Date.now()}>
                Login with Google redirect
              </BaseButton>
            </Stack>
          </Stack>
        </Stack.Item>
      </Stack>
    );
};

export default withApplicationInsights(Login, 'Login');