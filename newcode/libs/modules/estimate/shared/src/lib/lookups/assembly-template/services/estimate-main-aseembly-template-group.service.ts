/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { Observable } from 'rxjs';
import { IEstAssemblyCatEntity, IEstAssemblyStructureSearchData, IEstLineItemEntity } from '@libs/estimate/interfaces';

interface SearchResponse {
    dtos: IEstLineItemEntity[];
}

/**
 * Service for managing assembly template groups
 * Provides functionality to fetch assembly categories based on project ID and
 * to search assemblies based on specific criteria.
 */
@Injectable({
	providedIn: 'root'
})
export class EstimateMainAssemblyTemplateGroupService {
  
	protected http = inject(HttpClient);
	protected configurationService = inject(PlatformConfigurationService);
	protected queryPath = this.configurationService.webApiBaseUrl + 'estimate/assemblies/structure/treeForLookup';
	private assemblyTemplateCache: { [key: number]: IEstAssemblyCatEntity[] } = {};
	private estCatDataCache: { [key: number]: IEstLineItemEntity[] } = {}; // Cache for storing fetched assembly template data.

	/**
	 * Fetches a list of assembly categories for a given project ID, optionally bypassing the cache.
	 * @param projectId The ID of the project for which to fetch assembly categories.
	 * @param refresh If true, forces a refresh from the server, bypassing any cached data.
	 * @returns An Observable emitting an array of IEstAssemblyCatEntity objects.
	 */
	public getListByprojectId(projectId: number, refresh: boolean = false): Observable<IEstAssemblyCatEntity[]> {
		return new Observable((observer) => {
			// Checks cache first unless a refresh is requested.
			if (this.assemblyTemplateCache[projectId] && !refresh) {
				observer.next(this.assemblyTemplateCache[projectId]);
				observer.complete();
			} else {
				// Prepares the request data.
				const data: IEstAssemblyStructureSearchData = {
					projectId: projectId,
					isPrjAssembly: false,
					isShowInLeading: false,
				};
				// Makes an HTTP POST request to fetch assembly categories.
				this.http.post<IEstAssemblyCatEntity[]>(this.queryPath, data).subscribe({
					next: (res) => {
						// Updates the cache with the new data.
						this.assemblyTemplateCache[projectId] = res;
						observer.next(res);
						observer.complete();
					},
					error: (err) => {
						// Propagates any errors.
						observer.error(err);
					},
				});
			}
		});
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
}
