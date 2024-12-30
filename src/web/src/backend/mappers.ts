import { Framework } from "../state/frameState";
import { QueryResponse } from "../state/queryState";
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
        constellation: dbUserFramework.constellation,
        title: dbUserFramework.title,
        source: dbUserFramework.source,
        content: dbUserFramework.content,
        tags: dbUserFramework.tags
    }
}

export function mapUserFrameworkToDbUserFramework(userid: string, userFramework: UserFramework): DbUserFramework {
    return {
        _id: userFramework.id,
        userid: userid,
        constellation: userFramework.constellation,
        title: userFramework.title,
        source: userFramework.source,
        content: userFramework.content,
        tags: userFramework.tags
    } 
}

export function mapQueryResponseToFramework(queryResponse: QueryResponse): Framework {
    return {
        title: queryResponse.title,
        source: queryResponse.source,
        content: queryResponse.content
    }
}
