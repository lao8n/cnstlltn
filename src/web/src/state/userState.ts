import { DisplayPoint } from '../display/models';

export interface UserState {
    isLoggedIn: boolean;
    userId: string;
    constellationName: string;
    constellation: UserFramework[];
    clusterBy: string;
    clusters: Cluster[];
    updated: number;
    selectedContent: DisplayPoint | null;
}

export interface UserFramework {
    id: string;
    userId: string;
    constellation: string;
    title: string;
    content: string;
}

export interface Cluster {
    clusterBy: string;
    isLatest: boolean;
    cluster: string;
    coordinate: [number, number];
    frameworks: { [key: string]: [number, number]}
}

export interface LoginConfig {
    googleClientId: string;
}