export interface UserState {
    isLoggedIn: boolean;
    userId: string;
    constellation: UserFramework[];   
}

export interface UserFramework {
    title: string;
    content: string;
    cluster: string;
    coordinates: number[];
}

export interface LoginConfig {
    googleClientId: string;
}