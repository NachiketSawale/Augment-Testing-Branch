/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';
import { ENTITY_FILTER_RESULT_PAGINATION_INFO, IEntityFilterResultPaginationInfo } from '../../model';
import { PopupService } from '@libs/ui/common';
import { IEntityFilterApplyValue } from '../../model';
import { BasicsSharedEntityFilterResultPageSizeListComponent } from '../entity-filter-result-page-size-list/entity-filter-result-page-size-list.component';

/**
 * Entity Filter Result Pagination Component
 * Display the current number of pages and can also switch between different pages
 */
@Component({
	selector: 'basics-shared-entity-filter-result-pagination',
	templateUrl: './entity-filter-result-pagination.component.html',
	styleUrl: './entity-filter-result-pagination.component.scss'
})
export class BasicsSharedEntityFilterResultPaginationComponent {
	private readonly translateService = inject(PlatformTranslateService);
	private readonly popupService = inject(PopupService);

	/**
	 * Page info
	 */
	@Input()
	public pageInfo!: IEntityFilterResultPaginationInfo;

	/**
	 * Paging function
	 */
	@Input()
	public executePaging!: (pageNumber: number, pageSize: number) => Promise<void>;

	@ViewChild('btnPageSize')
	private btnPageSize!: ElementRef;

	public get hasPageSizeList(): boolean {
		return !!this.pageInfo.PageSizeList.length;
	}

	/**
	 * Get page info display text
	 */
	public get getPageInfoText(): string {
		const pageStartNumber = this.pageStartNumber;
		const pageEndNumber = this.pageEndNumber;
		return this.translateService.instant('basics.shared.showPageStartToEnd', {
			startNumber: pageStartNumber,
			endNumber: pageEndNumber,
			totalCount: this.pageInfo.HasMoreEntities ? this.pageInfo.EntitiesFound + '+' : this.pageInfo.EntitiesFound
		}).text;
	}

	/**
	 * Is enable forward
	 */
	public get forwardEnabled(): boolean {
		return this.pageEndNumber < this.pageInfo.EntitiesFound;
	}

	/**
	 * Is enable backward
	 */
	public get backwardEnabled(): boolean {
		return this.pageStartNumber > 1;
	}

	/**
	 * To first page
	 */
	public first() {
		this.paging(1, this.pageInfo.PageSize);
	}

	/**
	 * To prev page
	 */
	public prev() {
		this.paging(this.pageInfo.PageNumber - 1, this.pageInfo.PageSize);
	}

	/**
	 * To next page
	 */
	public next() {
		this.paging(this.pageInfo.PageNumber + 1, this.pageInfo.PageSize);
	}

	/**
	 * To last page
	 */
	public last() {
		const newPageNumber = Math.ceil(this.pageInfo.EntitiesFound / this.pageInfo.PageSize);
		this.paging(newPageNumber, this.pageInfo.PageSize);
	}

	/**
	 * Toggle page size popup.
	 */
	public togglePageSizeList(): void {
		const popup = this.popupService.toggle(
			this.btnPageSize,
			BasicsSharedEntityFilterResultPageSizeListComponent,
			{providers: [{provide: ENTITY_FILTER_RESULT_PAGINATION_INFO, useValue: this.pageInfo}]}
		);

		if (popup) {
			const subscription = popup.closed.subscribe((result) => {
				const res = result as IEntityFilterApplyValue<number>;
				if (res?.apply) {
					this.paging(1, res.value);
				}
				subscription.unsubscribe();
			});
		}
	}

	private get pageEndNumber() {
		let pageEndNumber = this.pageInfo.PageSize * this.pageInfo.PageNumber;
		pageEndNumber = pageEndNumber > this.pageInfo.EntitiesFound ? this.pageInfo.EntitiesFound : pageEndNumber;
		return pageEndNumber;
	}

	private get pageStartNumber() {
		return this.pageInfo.PageSize * (this.pageInfo.PageNumber - 1) + 1;
	}

	private paging(newPageNumber: number, newPageSize: number) {
		this.executePaging(newPageNumber, newPageSize);
	}
}