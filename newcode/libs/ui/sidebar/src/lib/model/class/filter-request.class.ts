/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject } from '@angular/core';

import { ISearchPayload, PlatformSearchAccessService } from '@libs/platform/common';

import { UiSidebarSimpleSearchFilterService } from '../../services/simple-search-filter.service';

import { IFilterInfo } from '../interfaces/filter-info.interface';

/**
 * Filter Request Class
 */
export class FilterRequest {
    /**
	 * Inject PlatformSearchAccessService
	 */
	private readonly platformSearchAccessService = inject(PlatformSearchAccessService);

	/**
	 * Returns the current search payload.
	 */
	public currentSearchPayload(): ISearchPayload {
		return this.platformSearchAccessService.currentSearchPayload();
	}

	/**
	 * Calculates previous pagenumber
	 * @method previousPageNumber
	 */
	public previousPageNumber(): void {
		if (this.currentSearchPayload().pageNumber > 0) {
			this.currentSearchPayload().pageNumber--;
		}
	}

	/**
	 * Updates the search pattern in the payload.
	 * @method updatePattern
	 * @param pattern
	 */
	public updatePattern(pattern: string): void {
		this.currentSearchPayload().pattern = pattern;
	}

	/**
	 * Calculates first pagenumber
	 * @method firstPageNumber
	 */
	public firstPageNumber(): void {
		this.currentSearchPayload().pageNumber = 0;
	}

	/**
	 * Calculates next pagenumber
	 * @method nextPageNumber
	 * @param {IFilterInfo} filterInfo
	 */
	public nextPageNumber(filterInfo: IFilterInfo): void {
		const maxPageNumber = UiSidebarSimpleSearchFilterService.calcMaxPageNumber(this, filterInfo.totalRec);
		if (this.currentSearchPayload().pageNumber < maxPageNumber) {
			if (filterInfo.endRec < filterInfo.totalRec) {
				this.currentSearchPayload().pageNumber++;
			}
		}
	}

	/**
	 * Calculates last pagenumber
	 * @method lastPageNumber
	 * @param {IFilterInfo} filterInfo
	 */
	public lastPageNumber(filterInfo: IFilterInfo): void {
		const maxPageNumber = UiSidebarSimpleSearchFilterService.calcMaxPageNumber(this, filterInfo.totalRec);
		this.currentSearchPayload().pageNumber = maxPageNumber - 1;
	}
}
