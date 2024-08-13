import { Cluster, UserFramework } from "../state/userState";
import { DbCluster, DbUserFramework } from "./models";

export function mapDbClusterToCluster(dbCluster: DbCluster): Cluster {
    return {
        clusterBy: dbCluster.clusterby,
        isLatest: dbCluster.islatest,
        cluster: dbCluster.cluster,
        coordinate: dbCluster.coordinate,
        frameworks: dbCluster.frameworks
    };
}

export function mapDbUserFrameworkToUserFramework(dbUserFramework: DbUserFramework): UserFramework {
    return {
        id: dbUserFramework._id,
        userId: dbUserFramework.userid,
        constellation: dbUserFramework.constellation,
        title: dbUserFramework.title,
        content: dbUserFramework.content,
    }
}