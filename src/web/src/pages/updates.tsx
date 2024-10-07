// react imports
import { Stack } from '@fluentui/react';
// ux imports
import { updatesPageStyle, updateHeadingStyle, updateTextStyle } from '../ux/pages/updates';

export const Updates = () => {
    return(
        <Stack styles={updatesPageStyle}>
            <Stack.Item styles={updateHeadingStyle}>
                Updates - last updated 10/07/2024
            </Stack.Item>
            <Stack.Item styles={updateTextStyle}>
                This page is for updates on cnstlltn. As we are still in pre-alpha there will be lots of bugs so please send any you see over to cnstlltn@outlook.com. We also welcome any feedback you wish to share including feature requests etc.
            </Stack.Item>
            <Stack.Item>
                <blockquote>
                    "You should take the approach that you're wrong. Your goal is to be less wrong A well thought out critique of whatever you're doing is as valuable as gold. You should seek that from everyone you can but particularly your friends. Usually, your friends know what's wrong, but they don't want to tell you because they don't want to hurt you You at least want to listen very carefully to what they say"
                </blockquote>
            </Stack.Item>
            <Stack.Item styles={updateHeadingStyle}>
                Current Major Bugs
            </Stack.Item>
            <Stack.Item styles={updateTextStyle}>
                <Stack.Item>
                    - No drill down button being shown.
                </Stack.Item>
                <Stack.Item>
                - Going to update to new OpenAI api for more reliable JSON responses which should mean that clustering should be much faster as I don't have to batch.
                </Stack.Item>
                <Stack.Item>
                - I think there is a bug in the drilldown where it does not drill down into thd correct note but maybe the one before? Sometimes it works, sometimes it doesn't.
                </Stack.Item>
                <Stack.Item>
                - [Fixed - again!] If you have a constellation with existing content and then try an already existing cluster by it creates loads of new clusters.
                </Stack.Item>
            </Stack.Item>
            <Stack.Item styles={updateHeadingStyle}>
                Currently Worked On Features
            </Stack.Item>
            <Stack.Item styles={updateTextStyle}>
                <Stack.Item>
                - [Released] Add the ability to delete notes - thanks Alex for feedback!
                </Stack.Item>
                <Stack.Item>
                - [Released] Add a browse section so one can navigate through an article or youtube transcript more easily. The approach I initially tried doesn't work that well so going to have to try another way.
                </Stack.Item>
                <Stack.Item>
                - [Released] Add a separate notes section which includes tags - thanks Jerry for feedback!
                </Stack.Item>
                <Stack.Item>
                - [Released] When adding notes have them visible as 'unclustered'
                </Stack.Item>
                <Stack.Item>
                - [Released] Add a playground constellation and a better introduction - thanks Link for feedback!
                </Stack.Item>
            </Stack.Item>
        </Stack>
    );
};