export interface UserState {
    isLoggedIn: boolean;
    userId: string;
    constellation: UserFramework[];
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