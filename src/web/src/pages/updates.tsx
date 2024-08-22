import { Stack } from '@fluentui/react';
import { updatesPageStyle } from '../ux/pages';
import { updateHeadingStyle, updateTextStyle } from '../ux/updates';

export const Updates = () => {
    return(
        <Stack styles={updatesPageStyle}>
            <Stack.Item styles={updateHeadingStyle}>
                Updates - last updated 08/22/2024
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
                - [Fixed] If you have a constellation with existing content and then try an already existing cluster by it creates loads of new clusters.
                </Stack.Item>
                <Stack.Item>
                - [Fixed] Google sign in is not using the correct ID
                </Stack.Item>
            </Stack.Item>
            <Stack.Item styles={updateHeadingStyle}>
                Currently Worked On Features
            </Stack.Item>
            <Stack.Item styles={updateTextStyle}>
                <Stack.Item>
                - [Released] When adding notes have them visible as 'unclustered'
                </Stack.Item>
                <Stack.Item>
                - [Released] Add a playground constellation and a better introduction - thanks Link for feedback!
                </Stack.Item>
                <Stack.Item>
                - [Released] Adding a separate input bar for source text such as a youtube transcript or an article
                </Stack.Item>
            </Stack.Item>
        </Stack>
    );
};