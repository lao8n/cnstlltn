import { Stack } from "@fluentui/react";
import { FC, ReactElement } from "react";
import { welcomeLineStyle } from "../ux/styles";

const WelcomePane: FC = (): ReactElement => {
    return (
        <Stack>
            <div className={welcomeLineStyle}>
                Tools for thinking
            </div>
        </Stack>
    )
}

export default WelcomePane