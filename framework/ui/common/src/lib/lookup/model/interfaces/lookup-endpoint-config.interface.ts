/*
 * Copyright(c) RIB Software GmbH
 */

import {ILookupSearchRequest} from './lookup-search-request.interface';
import { IEntityContext } from '@libs/platform/common';

/**
 * Web api lookup endpoint configuration
 */
export interface ILookupEndpointConfig<TItem extends object, TEntity extends object> {
    /**
     * Read endpoint
     */
    httpRead: {
        /**
         * The route
         */
        route: string;
        /**
         * The name of endpoint
         */
        endPointRead: string;
        /**
         * Use http post
         */
        usePostForRead?: boolean;
    };

    /**
     * Filter property for list endpoint
     */
    filterParam?: string | boolean;

    /**
     * Tree data
     */
    tree?: {
        /**
         * The parent property in data
         */
        parentProp: string;
        /**
         * The child property in data
         */
        childProp: string;
    };

    /**
     * Data processors
     */
    dataProcessors?: { processItem: (dataItem: TItem) => void }[];

    /**
     * Prepare filter for getSearchList
     * @param request
     * @param context
     */
    prepareSearchFilter?: (request: ILookupSearchRequest, context?: IEntityContext<TEntity>) => string | object;

    /**
     * Prepare filter for getList
     */
    prepareListFilter?: (context?: IEntityContext<TEntity>) => string | object;
}