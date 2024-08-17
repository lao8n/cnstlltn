import { createContext } from 'react';
import { reactPlugin } from './telemetryService';

const TelemetryContext = createContext(reactPlugin);

export const TelemetryProvider = TelemetryContext.Provider;
export const TelemetryConsumer = TelemetryContext.Consumer;
export default TelemetryContext;
