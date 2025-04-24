/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { IFilterResult,PlatformTranslateService, Translatable } from '@libs/platform/common';

import { UiSidebarSimpleSearchFilterService } from '../../services/simple-search-filter.service';

import { ISimpleSearchOption } from '../../model/interfaces/simple-search-options.interface';

/**
 * Implements the basic functionality for google search
 */
@Component({
	selector: 'ui-sidebar-simple-search',
	templateUrl: './simple-search.component.html',
	styleUrls: ['./simple-search.component.scss'],
})
export class UiSidebarSimpleSearchComponent implements OnDestroy {
	/**
	 * inject the router
	 */
	private router = inject(Router);

	/**
	 * inject the UiSidebarSimpleSearchFilterService
	 */
	public readonly simpleSearchFilterService = inject(UiSidebarSimpleSearchFilterService);

	/**
	 * inject the PlatformTranslateService
	 */
	public readonly translate = inject(PlatformTranslateService);

	/**
	 * inject the PlatformTranslateService
	 */
	private routeSubscription: Subscription | undefined;

	/**
	 * placeholder for search filter
	 */
	public placeholder: Translatable = this.translate.instant('cloud.desktop.sdGoogleSearchFilter').text;

	/**
	 * template reference variable of type ElementRef
	 */

	@ViewChild('searchInput', { static: false }) public searchInputRef!: ElementRef;

	/**
	 * searchOptions is an object containing various properties related to search functionality
	 */
	public searchOptions: ISimpleSearchOption = {
		filterInfo: this.simpleSearchFilterService.filterInfo,
		filterRequest: this.simpleSearchFilterService.getFilterRequestPayload(),
		showRecordsInfo: true,
	};

	public constructor() {
		this.routeSubscription = this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
			this.resetFilterInfo();
		});
	}

	/**
	 *  This method resets search pattern
	 * @method onClearSearch
	 */
	public onClearSearch(): void {
		this.searchOptions.filterRequest.pattern = '';
		const inputElement = this.searchInputRef.nativeElement as HTMLInputElement;
		if (inputElement) {
			inputElement.value = '';
		}
	}

	/**
	 * This method resets pageNumber to 0 before starting a new search
	 * @method onNewSearch
	 */
	public onNewSearch(): void {
		this.searchOptions.filterRequest.pageNumber = 0;
		this.onStartSearch(true);
	}

	/**
	 * This method execute the search fucntionality based on filtered service data
	 * @method onStartSearch
	 */
	public onStartSearch(isNewSearch: boolean = false): void {
		const filterRequest = this.searchOptions.filterRequest;
		const filterInfo = this.searchOptions.filterInfo;

		this.simpleSearchFilterService.updateSearchPattern(filterRequest.pattern);

		filterInfo.isPending = true;
		filterInfo.recordInfoText = this.translate.instant('cloud.desktop.sdSearchRunning').text;

		this.simpleSearchFilterService.executeSidebarSearch$().then((data: IFilterResult) => {
			if (data && data.RecordsFound > 0) {
				if (isNewSearch) {
					filterInfo.startRec = 1;
				} else {
					filterInfo.startRec = filterRequest.pageNumber * filterRequest.pageSize + 1;
				}
				filterInfo.endRec = Math.min(filterInfo.startRec - 1 + data.RecordsRetrieved, data.RecordsFound);

				filterInfo.totalRec = data.RecordsFound;

				filterInfo.recordInfoText = filterInfo.startRec + ' - ' + filterInfo.endRec + ' / ' + filterInfo.totalRec;

				filterInfo.forwardEnabled = filterInfo.endRec < filterInfo.totalRec;
				filterInfo.backwardEnabled = filterInfo.startRec > 1;
				filterInfo.executionInfo = data.ExecutionInfo;
			} else {
				filterInfo.recordInfoText = this.translate.instant('cloud.desktop.sdGoogleNoSearchResult').text;
			}
			filterInfo.isPending = false;
		});
	}

	/**
	 * This method excutes filterPageBackward & onStartSearch methods to step one page backward
	 * @method onPageBackward
	 */
	public onPageBackward(): void {
		this.simpleSearchFilterService.filterPageBackward();
		this.onStartSearch();
	}

	/**
	 * This method excutes filterPageForward & onStartSearch methods to step one page forward
	 * @method onPageForward
	 */
	public onPageForward(): void {
		this.simpleSearchFilterService.filterPageForward();
		this.onStartSearch();
	}

	/**
	 * This method excutes filterPageFirst & onStartSearch methods to naviagte the first page of the
	 * filtered search results.
	 * @method onPageFirst
	 */
	public onPageFirst(): void {
		this.simpleSearchFilterService.filterPageFirst();
		this.onStartSearch();
	}

	/**
	 * This method excutes filterPageLast & onStartSearch methods to naviagte the last page of the
	 * filtered search results.
	 * @method onPageLast
	 */
	public onPageLast(): void {
		this.simpleSearchFilterService.filterPageLast();
		this.onStartSearch();
	}

	/**
	 * To reset filter info
	 * @method resetFilterInfo
	 */
	private resetFilterInfo(): void {
		this.simpleSearchFilterService.filterInfo.reset();
		this.searchOptions.filterRequest.pageNumber = 0;
		this.searchOptions.filterRequest.pattern = '';
	}

	/**
	 * To unsubscribe the subscriptions
	 */
	public ngOnDestroy(): void {
		if (this.routeSubscription) {
			this.routeSubscription.unsubscribe();
		}
	}
}
