import { RestService } from "./restService";
import { QueryResponse } from "../models/queryState";

export class QueryService extends RestService<QueryResponse> {

    public constructor(baseUrl: string, baseRoute: string) {
        super(baseUrl, baseRoute);
    }
}