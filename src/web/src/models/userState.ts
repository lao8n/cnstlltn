export interface UserState {
    isLoggedIn: boolean;
    userId: string;
    constellation: UserFramework[];   
}

export interface UserFramework {
    title: string;
    content: string;
}

export interface LoginConfig {
    googleClientId: string;
}