// react imports
import { ChangeEvent, FC, ReactElement, useContext, useMemo, useState, useEffect } from "react";
import { SearchBox, Stack } from "@fluentui/react";
// state imports
import { bindActionCreators } from "../state/actions/actionCreators";
import { AppContext } from "../state/applicationState";
import UserAppContext from "../state/userContext";
import { FrameActions } from "../state/actions/frameActions";
import * as frameActions from "../state/actions/frameActions";
import { FrameRequest } from "../state/frameState";
// components imports
import { LoadingDots } from "../components/loadingDots";
// ux imports
import { analyseStackStyle} from "../ux/panes/analyse";
import { badInputNotifications, buttonStyles, textFieldStyles, stackItemPadding } from "../ux/shared/components";
import { buttonTextStyles } from "../ux/panes/query";
import { blackLoadingDots } from "../ux/components/loadingDots";

const AnalysePane: FC = (): ReactElement => {
    const appContext = useContext<AppContext>(UserAppContext)
    const actions = useMemo(() => ({
        frame: bindActionCreators(frameActions, appContext.dispatch) as unknown as FrameActions
    }), [appContext.dispatch]);

    // display
    const [newAnalyse, setNewAnalyse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emptyAnalyse, setEmptyAnalyse] = useState(false);

    // functions
    const onTypeAnalyse = (_: ChangeEvent<HTMLInputElement> | undefined, newValue?: string) => {
        setNewAnalyse(newValue || '');
    }
    const onSubmit = async () => {
        if (newAnalyse) {
            setIsLoading(true);
            const frameRequest: FrameRequest = {argument: newAnalyse, frameworks: appContext.state.userState.constellation};
            const frameResponses = await actions.frame.postFrame(frameRequest);
            actions.frame.setFrameResponses(frameResponses);
            setIsLoading(false);
        } else {
            setEmptyAnalyse(true);
        }
    }

    // effects
    useEffect(() => {
        if (newAnalyse) {
            setEmptyAnalyse(false);
        }
    }, [newAnalyse])

    return (
        <Stack styles={analyseStackStyle}>
            <Stack.Item tokens={stackItemPadding}>
                <SearchBox
                    value={newAnalyse}
                    placeholder="Analyse your argument"
                    onChange={onTypeAnalyse}
                    onSearch={onSubmit}
                    styles={textFieldStyles}
                    iconProps={{ iconName: "None" }}
                />
            </Stack.Item>
            {emptyAnalyse &&
                (
                    <Stack.Item styles={badInputNotifications}>
                        Hey, add an argument to analyse.
                    </Stack.Item>
                )
            }
        <Stack.Item tokens={stackItemPadding}>
                {isLoading ? (
                    <LoadingDots style={blackLoadingDots}/>
                ) : (
                    <Stack styles={analyseStackStyle}>
                        {appContext.state.frameState.responses && appContext.state.frameState.responses.map((response, index) => (
                            <button 
                                key={index} 
                                className={buttonStyles}>
                                <span className={buttonTextStyles}>
                                    <strong>{response.title}</strong>
                                </span>
                                <span className={buttonTextStyles}>
                                    <strong>Steelman</strong>: {response.steelman}
                                </span>
                                <span className={buttonTextStyles}>
                                    <strong>Strawman</strong>: {response.strawman}
                                </span>
                            </button>
                        ))}
                    </Stack>
                )}
            </Stack.Item>
        </Stack>
    )
    
}

export default AnalysePane;