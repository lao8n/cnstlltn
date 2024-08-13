export interface DbCluster {
    clusterby: string;
    islatest: boolean;
    cluster: string;
    coordinate: [number, number];
    frameworks: { [key: string]: [number, number]}
}

export interface DbUserFramework {
    _id: string;
    userid: string;
    constellation: string;
    title: string;
    content: string;
}