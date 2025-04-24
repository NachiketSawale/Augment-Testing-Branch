/*
 * Copyright(c) RIB Software GmbH
 */

import {Observable, map, of} from 'rxjs';
import {inject, Injectable} from '@angular/core';
import {IIdentificationData} from '@libs/platform/common';

import {
    ILookupSearchRequest,
    ILookupSearchResponse,
    LookupSearchResponse,
    UiCommonLookupReadonlyDataService
} from '@libs/ui/common';
import {IMaterialSearchEntity, BasicsSharedMaterialSearchService, MaterialSearchRequest} from '../../material-search';
import {BasicsSharedMaterialLookupComponent} from '../components/material-lookup/material-lookup.component';
import {BasicsSharedMaterialCreateSimilarMaterialService} from '../../material-search/services/material-create-similar-material.service';

/**
 * Material lookup data service.
 */
@Injectable({
    providedIn: 'root'
})
export class BasicsSharedMaterialLookupService<TEntity extends  object> extends UiCommonLookupReadonlyDataService<IMaterialSearchEntity, TEntity> {
    private materialSearchService = inject(BasicsSharedMaterialSearchService);
    private materialSimilarService = inject(BasicsSharedMaterialCreateSimilarMaterialService);
    private queryPath = this.configService.webApiBaseUrl + 'basics/material/commoditysearch/';

    /**
     * The constructor
     */
    public constructor() {
        super({
            uuid: 'f1661fdf78688a65b8fcf5c3b695e0ec',
            idProperty: 'Id',
            valueMember: 'Id',
            displayMember: 'Code',
            dialogComponent: BasicsSharedMaterialLookupComponent
        });
        this.paging.enabled = true;
        this.paging.pageCount = 10;
    }

    /**
     *
     * @param key
     */
    public getItemByKey(key: IIdentificationData): Observable<IMaterialSearchEntity> {
        const cacheItem = this.cache.getItem(key);

        if (cacheItem) {
            return of(cacheItem);
        }

        return this.http.get(this.queryPath + 'getcommoditybyid?materialId=' + key.id).pipe(map((response) => {
            const entity = response as IMaterialSearchEntity;

            this.processItems([entity]);
            this.cache.setItem(entity);

            return entity;
        }));
    }

    /**
     * Get whole list
     */
    public getList(): Observable<IMaterialSearchEntity[]> {
        throw new Error('Should not be called due to large amount of data');
    }

    /**
     * Get search list of material
     * @param request
     */
    public getSearchList(request: ILookupSearchRequest): Observable<ILookupSearchResponse<IMaterialSearchEntity>> {
        const searchRequest = new MaterialSearchRequest();

        searchRequest.SearchText = request.searchText;
        searchRequest.ItemsPerPage = request.pageState!.pageSize;
        searchRequest.CurrentPage = request.pageState!.pageNumber + 1;

        return this.materialSearchService.search(searchRequest).pipe(map(response => {
            this.processItems(response.items);
            this.cache.setItems(response.items);

            const res = new LookupSearchResponse(response.items);
            res.itemsFound = response.maxGroupCount;
            res.itemsRetrieved = response.items.length;
            return res;
        }));

    }
}