export interface UserState {
    isLoggedIn: boolean;
    userId: string;
    constellationName: string;
    constellation: UserFramework[];
    clusterBy: string;
    clusters: Cluster[];
    updated: number;
}

export interface UserFramework {
    _id: string;
    userid: string;
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