export interface UserState {
    isLoggedIn: boolean;
    constellation: UserFramework[];   
}

export interface UserFramework {
    title: string;
    content: string;
}