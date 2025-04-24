/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { Observable } from 'rxjs';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
interface SearchResponse {
    dtos: IEstLineItemEntity[];
}

/**
 * Service for searching and retrieving assembly template data for estimation purposes.
 * Utilizes caching to improve performance by storing previously fetched data.
 */
@Injectable({
    providedIn: 'root'
})

export class EstimateMainPlantAssemblyTemplateSearchService {
    protected http = inject(HttpClient); // HttpClient injection for making HTTP requests.
    protected configurationService = inject(PlatformConfigurationService); // Configuration service for accessing API base URLs.
    protected route = 'estimate/assemblies/structure/'; // Base route for assembly structure API endpoints.
    protected endPoint = 'treeForLookup'; // Specific endpoint for tree lookup functionality.
    private estCatDataCache: { [key: number]: IEstLineItemEntity[] } = {}; // Cache for storing fetched assembly template data.
    protected queryPath = this.configurationService.webApiBaseUrl + this.route + this.endPoint + '?projectId='; // Full path for the query API.

    /**
     * Retrieves a list of assembly line items for a given project ID, with optional cache bypass.
     * @param projectId The ID of the project for which to retrieve assembly line items.
     * @param refresh If true, bypasses the cache and fetches fresh data from the server.
     * @returns An Observable emitting an array of IEstLineItemEntity objects.
     */
    public getList(projectId: number, refresh: boolean = false): Observable<IEstLineItemEntity[]> {
        return new Observable((observer) => {
            if (this.estCatDataCache[projectId] && !refresh) {
                observer.next(this.estCatDataCache[projectId]);
                observer.complete();
            } else {
                this.http.get(this.queryPath + projectId).subscribe((res) => {
                    const items = res as IEstLineItemEntity[];
                    if (this.isSectionLoaded(projectId, items)) {
                        items.forEach((item) => {
                            item.ProjectFk = projectId; 
                        });
                    }
                    this.estCatDataCache[projectId] = items; // Update cache with new data.
                    observer.next(items);
                    observer.complete();
                });
            }
        });
    }

    /**
     * Filters a list of assembly line items by project ID.
     * @param projectId The ID of the project to filter by.
     * @param list The list of assembly line items to filter.
     * @returns A filtered array of IEstLineItemEntity objects, or undefined if no items match.
     */
    public getListBySection(projectId: number, list: IEstLineItemEntity[]): IEstLineItemEntity[] | undefined {
        return list.filter((v) => (v.ProjectFk = projectId));
    }

    /**
     * Checks if the section data for a given project ID is already loaded.
     * @param projectId The ID of the project to check.
     * @param data The array of assembly line items to search through.
     * @returns True if the section is loaded, false otherwise.
     */
    private isSectionLoaded(projectId: number, data: IEstLineItemEntity[]) {
        return data.length > 0 && data.findIndex((item) => item.ProjectFk == projectId) !== -1;
    }

    /**
     * Searches for assembly line items based on various criteria.
     * @param ProjectId The ID of the project to search within.
     * @param HeaderJobFk The foreign key of the header job, if applicable.
     * @param LgmJobFk The foreign key of the LGM job, if applicable.
     * @param filter A string filter to apply to the search.
     * @param filterByCatStructure A filter specifying the category structure to search within.
     * @param itemsPerPage The number of items to return per page.
     * @returns An Observable emitting an array of IEstLineItemEntity objects matching the search criteria.
     * used
     */
    public search(ProjectId: number, HeaderJobFk: number | null, LgmJobFk: number | null, filter: string, filterByCatStructure: string, itemsPerPage: number): Observable<IEstLineItemEntity[]> {
        // Create searchInfo object and copy parameters
        const searchInfo = {
            ProjectId: ProjectId,
            HeaderJobFk: HeaderJobFk,
            LgmJobFk: LgmJobFk,
            Filter: filter,
            FilterByCatStructure: filterByCatStructure,
            ItemsPerPage: itemsPerPage
        };
    
        return new Observable((observer) => {
            this.http.post<SearchResponse>(this.configurationService.webApiBaseUrl + 'estimate/assemblies/getsearchlist', searchInfo).subscribe((res: SearchResponse) => {
                const dtos = res.dtos; 
                observer.next(dtos); 
                observer.complete(); 
            });
        });
    }
}