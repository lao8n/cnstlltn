import { Stack, BaseButton } from '@fluentui/react';
import { withApplicationInsights } from '../components/telemetry';

const Login = () => {
    return (
        <Stack verticalAlign="center" horizontalAlign="center">
                        <Stack.Item> Login into cnstlltn </Stack.Item>
        <Stack.Item>
          <Stack horizontalAlign="center" tokens={{ childrenGap: 10 }}>
            <Stack>
              <BaseButton href="/.auth/login/google">Login with Google</BaseButton>
            </Stack>
            <Stack>
              trackEvent(ActionTypes.LOGIN_PAGE.toString());
              <BaseButton href={`/.auth/login/google?post_login_redirect_uri=${encodeURIComponent('/login-redirect')}`}>
                Login with Google redirect
              </BaseButton>
            </Stack>
            <Stack>
              <BaseButton href={`/.auth/login/aad?post_login_redirect_uri=${encodeURIComponent('/login-redirect')}`}>
                console.log("Login with Microsoft redirect")
                Login with Microsoft redirect
              </BaseButton>
            </Stack>
          </Stack>
        </Stack.Item>
      </Stack>
    );
};

export default withApplicationInsights(Login, 'Login');