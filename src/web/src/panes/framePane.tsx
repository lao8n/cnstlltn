// react imports
import { ChangeEvent, FC, ReactElement, useContext, useMemo, useState } from "react";
// state imports
import { bindActionCreators } from "../state/actions/actionCreators";
import { AppContext } from "../state/applicationState";
import UserAppContext from "../state/userContext";
import { FrameActions } from "../state/actions/frameActions";
import * as frameActions from "../state/actions/frameActions";
import { FrameRequest } from "../state/frameState";

const FramePane: FC = (): ReactElement => {
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
    
    return <div>FramePane</div>
}

export default FramePane;