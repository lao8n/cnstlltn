import { Stack, BaseButton, Icon } from '@fluentui/react';
import { withApplicationInsights } from '../components/telemetry';

const Login = () => {
    return (
        <Stack verticalAlign="center" horizontalAlign="center">
                        <Stack.Item> Login into cnstlltn </Stack.Item>
        <Stack.Item>
          <Stack horizontalAlign="center" tokens={{ childrenGap: 10 }}>
            <Stack>
              <Icon iconName="GoogleLogo" styles={{ root: { fontSize: 24 } }} />
              <BaseButton href="/.auth/login/google">Login with Google</BaseButton>
            </Stack>
            <Stack>
              <Icon iconName="GoogleLogo" styles={{ root: { fontSize: 24 } }} />
              <BaseButton href="/.auth/login/google?post_login_redirect_uri=/constellation">
                Login with Google redirect
              </BaseButton>
            </Stack>
          </Stack>
        </Stack.Item>
      </Stack>
    );
};

export default withApplicationInsights(Login, 'Login');