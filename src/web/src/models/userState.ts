export interface UserState {
    isLoggedIn: boolean;
    userId: string;
    constellationName: string,
    constellation: UserFramework[];
    clusterBy: string,
    cluster: Cluster[];
}

export interface UserFramework {
    title: string;
    content: string;
    clusterby: { [key: string]: Cluster};
}

export interface Cluster {
    cluster: string;
    coordinate: [number, number];
}

export interface LoginConfig {
    googleClientId: string;
}