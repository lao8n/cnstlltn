import { Stack } from '@fluentui/react';
import { withApplicationInsights } from '../telemetry/telemetry';

const Home = () => {
    return (
        <Stack>
        </Stack>
    );
};

export default withApplicationInsights(Home, 'Home');