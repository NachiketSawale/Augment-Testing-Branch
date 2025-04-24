/*
 * Copyright(c) RIB Software GmbH
 */

import {isString, get} from 'lodash';
import {Observable, map} from 'rxjs';

import {IEntityContext, IIdentificationData} from '@libs/platform/common';

import {ILookupSearchRequest} from '../model/interfaces/lookup-search-request.interface';
import {ILookupSearchResponse} from '../model/interfaces/lookup-search-response.interface';
import {UiCommonLookupReadonlyDataService} from './lookup-readonly-data.service';
import {ILookupConfig} from '../model/interfaces/lookup-options.interface';
import {ILookupEndpointConfig} from '../model/interfaces/lookup-endpoint-config.interface';
import {LookupSearchResponse} from '../model/lookup-search-response';
import { LookupIdentificationData } from '../model/lookup-identification-data';

/**
 * The lookup data service whose data is from web api endpoint
 */
export class UiCommonLookupEndpointDataService<TItem extends object, TEntity extends object = object> extends UiCommonLookupReadonlyDataService<TItem, TEntity> {

    /**
     * The constructor
     * @param endpoint
     * @param config
     */
    public constructor(public endpoint: ILookupEndpointConfig<TItem, TEntity>, config: ILookupConfig<TItem, TEntity>) {
        super(config);
        this.cache.enabled = true;
        this.paging.enabled = false;
        this.config.canListAll = !endpoint.filterParam;
        this.syncService = {
            getListSync: () => {
                return this.cache.getAll();
            }
        };
        this.config.searchSync = true;
        this.config.isClientSearch = true;

        if (endpoint.dataProcessors) {
            this.dataProcessors = this.dataProcessors.concat(endpoint.dataProcessors);
        }
    }

    /**
     * Get data item by identification data
     * @param key
     * @param context
     * @deprecated use getItemByKeyAsync instead
     */
    public getItemByKey(key: IIdentificationData, context?: IEntityContext<TEntity>): Observable<TItem> {
        return new Observable<TItem>(observer => {
            const cacheItem = this.cache.getItem(key);

            if (cacheItem) {
                observer.next(cacheItem);
                observer.complete();
            } else {
                this.getList(context).subscribe(list => {
                    list.some(item => {
                        const i = this.identify(item);
                        if (LookupIdentificationData.equal(key, i)) {
                            observer.next(item);
                            observer.complete();
                            return true;
                        }
                        return false;
                    });
                });
            }
        });
    }

    /**
     * Get list
     * @param context
     * @deprecated use getListAsync instead
     */
    public getList(context?: IEntityContext<TEntity>): Observable<TItem[]> {
        if (this.endpoint.filterParam) {
            const filter = this.prepareListFilter(context);
            return this.getListByFilter(filter).pipe(map(e => e.items));
        }

        return new Observable(o => {
            if (this.cache.loaded) {
                o.next(this.cache.list);
                o.complete();
            } else {
                this.readData().subscribe(res => {
                    let list = res as TItem[];

                    list = this.handleList(list);

                    if (this.cache.enabled) {
                        this.cache.setList(list);
                    }

                    o.next(list);
                    o.complete();
                });
            }
        });
    }

    /**
     * Get search list
     * @param request
     * @param context
     * @deprecated use getSearchListAsync instead
     */
    public getSearchList(request: ILookupSearchRequest, context?: IEntityContext<TEntity>): Observable<ILookupSearchResponse<TItem>> {
        const filter = this.prepareSearchFilter(request, context);
        return this.getListByFilter(filter);
    }

    protected override convertList(list: TItem[]) {
        if (this.endpoint.tree) {
            list = this.flattenTreeList(list);
        }

        return list;
    }

    private getListByFilter(filter: string | object | undefined): Observable<ILookupSearchResponse<TItem>> {
        return new Observable<ILookupSearchResponse<TItem>>(o => {
            const cacheKey = JSON.stringify(filter);
            const cache = this.cache.getSearchList(cacheKey);

            if (cache) {
                o.next(cache);
                o.complete();
            } else {
                this.readData(filter).subscribe(res => {
                    let list = res as TItem[];

                    list = this.handleList(list);

                    const response = new LookupSearchResponse(list);

                    if (this.cache.enabled) {
                        this.cache.setSearchList(cacheKey, response);
                    }

                    o.next(response);
                    o.complete();
                });
            }
        });
    }

    private flattenTreeList(treeList: TItem[], flatList?: TItem[]) {
        if (!flatList) {
            flatList = [];
        }

        treeList.forEach((item) => {
            flatList!.push(item);

            const children = get(item, this.endpoint.tree!.childProp);

            if (children && children.length > 0) {
                this.flattenTreeList(children, flatList);
            }
        });

        return flatList;
    }

    private readData(filterData?: unknown) {
	    const httpRead = this.endpoint.httpRead;
	    let route = httpRead.route;

	    // Regularly the route should not end with '/' which will be automatically inserted in combination
	    if (!route.endsWith('/')) {
		    route += '/';
	    } else {
		    console.log('Please remove the last "/" character from route string, it is not necessary!');
	    }

	    if (filterData && !isString(filterData)) {
		    return this.post(route + httpRead.endPointRead, filterData);
	    }

	    if (httpRead.usePostForRead) {
		    return this.post(route + httpRead.endPointRead);
	    }

	    return this.get(route + httpRead.endPointRead + (filterData ? `?${filterData}` : ''));
    }

    protected prepareSearchFilter(request: ILookupSearchRequest, context?: IEntityContext<TEntity>): string | object | undefined {
        if (this.endpoint.prepareSearchFilter) {
            return this.endpoint.prepareSearchFilter(request, context);
        }
        return this.prepareListFilter(context);
    }

    protected prepareListFilter(context?: IEntityContext<TEntity>): string | object | undefined {
        if (this.endpoint.prepareListFilter) {
            return this.endpoint.prepareListFilter(context);
        }
        if (this.endpoint.filterParam) {
            throw new Error('prepareListFilter is not defined!');
        }
        return undefined;
    }
}