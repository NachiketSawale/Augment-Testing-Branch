/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, Injector, inject } from '@angular/core';

import { IFilterResult, ISearchPayload, PlatformModuleManagerService,PlatformTranslateService } from '@libs/platform/common';

import { FilterInfo } from '../model/class/filter-info.class';
import { FilterRequest } from '../model/class/filter-request.class';

/**
 * This class represent the sidebar search filtering functionality.
 */
@Injectable({
	providedIn: 'root',
})
export class UiSidebarSimpleSearchFilterService {
	/**
	 * Inject the PlatformTranslateService
	 */
	public readonly translate = inject(PlatformTranslateService);

	/**
	 * FilterInfo class instance
	 */
	public filterInfo = new FilterInfo();

	/**
	 * FilterRequest class instance
	 */
	public filterRequest!: FilterRequest;

	/**
	 * inject the PlatformModuleManagerService
	 */
	private platformModuleManagerService = inject(PlatformModuleManagerService);

	/**
	 * The Angular injector instance.
	 */
	private readonly injector = inject(Injector);

	public constructor() {
		this.filterRequest = new FilterRequest();
	}

	/**
	 * Returns filter request payload
	 * @method getFilterRequestPayload
	 */
	public getFilterRequestPayload(): ISearchPayload {
		return this.filterRequest.currentSearchPayload();
	}
	/**
	 * Updates the search pattern
	 * @method updateSearchPattern
	 */
	public updateSearchPattern(pattern: string): void {
		this.filterRequest.updatePattern(pattern);
	}

	/**
	 * This method execute the search using searchPayload
	 * @method executeSidebarSearch$
	 * @returns {Promise<IFilterResult>}
	 */
	public async executeSidebarSearch$(): Promise<IFilterResult> {
		const currentModule = this.platformModuleManagerService.activeModule;

		const mainEntityAccess = currentModule?.getMainEntityAccess(this.injector);

		if (mainEntityAccess && mainEntityAccess.sidebarSearchSupport) {
			const searchPayload = this.getFilterRequestPayload();
			return mainEntityAccess.sidebarSearchSupport.executeSidebarSearch(searchPayload);
		} else {
			throw new Error('Sidebar search is not supported');
		}
	}

	/**
	 * This method step one page back if possible
	 *  @method filterPageBac?kward
	 */
	public filterPageBackward(): void {
		this.filterRequest.previousPageNumber();
	}

	/**
	 *This method navigate to the first page of the filtered search results.
	 *  @method filterPageFirst
	 */
	public filterPageFirst(): void {
		this.filterRequest.firstPageNumber();
	}

	/**
	 *  This method step one page further if possible
	 * @method filterPageForward
	 */
	public filterPageForward(): void {
		this.filterRequest.nextPageNumber(this.filterInfo);
	}

	/**
	 * This method navigate to the last page of the filtered search results.
	 *  @method filterPageLast
	 */
	public filterPageLast(): void {
		this.filterRequest.lastPageNumber(this.filterInfo);
	}

	/**
	 * This method is to calculate the maximum page number based on the total number of records and the page size
	 *  @method calcMaxPageNumber
	 * @param self represents an instance of the FilterRequest class
	 * @param totalRec represents the total number of records
	 */
	public static calcMaxPageNumber(self: FilterRequest, totalRec: number): number {
		return ((totalRec / self.currentSearchPayload().pageSize) | 0) + (totalRec % self.currentSearchPayload().pageSize > 0 ? 1 : 0);
	}
}
