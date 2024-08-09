export interface UserState {
    isLoggedIn: boolean;
    userId: string;
    constellationName: string;
    constellation: UserFramework[];
    clusterBy: string;
    cluster: Cluster[];
    updated: number;
}

export interface UserFramework {
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