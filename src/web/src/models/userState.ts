export interface Claim {
    typ: string;
    val: string;
}
  
export interface User {
    identityProvider: string;
    userId: string;
    userDetails: string;
    userRoles: string[];
    claims: Claim[];
}

export interface UserState {
    userId?: string;
    isAuthenticated: boolean;
}