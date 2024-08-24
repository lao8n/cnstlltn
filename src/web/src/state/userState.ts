export interface UserState {
    isLoggedIn: boolean;
    userId: string;
    constellationName: string;
    constellation: UserFramework[];
    clusterBy: string;
    clusters: Cluster[];
    updated: number;
    selectedContent: UserFramework | null;
}

export interface UserFramework {
    id: string;
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