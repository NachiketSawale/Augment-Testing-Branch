/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, EventEmitter, Input, OnChanges, Output, OnInit, inject, } from '@angular/core';

import { IPagination } from '../../model/interface/pagination-number.interface';
import { RulerFactoryOption } from '../../model/enum/ruler-factory-option.enum';

import { WebApiHelpMainService } from '../../services/webapihelp-main.service';

/**
 * This component provide paginator for swagger.
 */
@Component({
	selector: 'webapihelp-main-paginator',
	templateUrl: './webapihelp-main-paginator.component.html',
	styleUrls: ['./webapihelp-main-paginator.component.scss'],
})
export class WebApiHelpMainPaginatorComponent implements OnInit, OnChanges {

	/**
	 * Maximum size of page number.
	 */
	public maxPageSize!: number;

	/**
	 * Indexing number
	 */
	public index = 1;

	/**
	 * total number of page size.
	 */
	public pageSize!: number;

	/**
	 * Total number page count.
	 */
	@Input() public totalCount!: number;

	/**
	 * The maximum Rural length of the paginator
	 */
	@Input() public rulerLength!: number;

	/**
	 * The Page number.
	 */
	@Output() public pageNumber: EventEmitter<number> = new EventEmitter<number>();

	/**
	 * Injected WebApiHelpService  
	 */
	private webApiHelpService = inject(WebApiHelpMainService);

	/**
	 * This function is used to set paginator pages, maxlength and index
	 * @returns { IPagination } the object for paginator page number.
	 */
	public get getPagination(): IPagination {
		const { index, maxPageSize, rulerLength } = this;
		const pages = this.getRuler(index, maxPageSize, rulerLength);
		return { index, maxPageSize, pages } as IPagination;
	}


	public ngOnInit(): void {
		this.maxPageSize = this.totalCount;
		this.totalCount > 10 ? this.rulerLength = 10 : this.rulerLength = this.totalCount;
	}
	public ngOnChanges(): void {
		this.maxPageSize = this.totalCount;
		this.totalCount > 10 ? this.rulerLength = 10 : this.rulerLength = this.totalCount;

	}

	/**
	 * This function is for check pagenumber is under certain criteria 
	 * @param { number } pageNumber The page number.
	 * @param { number } index The index Number.
	 * @param { number } maxPageSize The maximum page size.
	 * @returns { boolean } return boalean value.
	 */
	public isAllowNavigation = (pageNumber: number, index: number, maxPageSize: number): boolean => {
		return pageNumber !== index && pageNumber > 0 && pageNumber <= maxPageSize;
	};

	/**
	 * This method is used to navigate to another page number.
	 * @param { number } pageNumber  The Page number.
	 */
	public navigateToPage(pageNumber: number): void {
		if (this.isAllowNavigation(pageNumber, this.index, this.maxPageSize)) {
			this.index = pageNumber;
			this.pageNumber.emit(this.index);
			this.webApiHelpService.setSearchInput(String(pageNumber));
		}
	}

	/**
	 * This method used to track the index.
	 * @param { number } index  The index number.
	 * @returns { number } Index number.
	   */
	public getTrack(index: number): number {
		return index;
	}

	/**
	 * This method is for select ruler factory option like start,End,Default.
	 * @param { number } currentIndex This is Current Index Number.
	 * @param { number } min  This is the minimum size of the ruler.
	 * @param { number } maxPageSize This is the maximum size of page.
	 * @returns { RulerFactoryOption } return ruler factory option like start,End,Default.
	 */
	private getRulerOption = (currentIndex: number, min: number, maxPageSize: number): RulerFactoryOption => {
		return (currentIndex <= min) ? RulerFactoryOption.Start : ((currentIndex >= maxPageSize - min) ? RulerFactoryOption.End : RulerFactoryOption.Default);
	};

	/**
	 * This method is selected page is start or end or default. 
	 * @param { number } currentIndex  The selected current Index number.
	 * @param { number } index 	The index number.
	 * @param { number } min   The minimum size fo ruler.
	 * @param { number } maxPageSize  The maximum size of ruler.
	 * @param { number } rL 	The length of the ruler.
	 * @returns  { number } return the selected page is start or end or default. 
	 */
	private getRulerFactory = (currentIndex: number, index: number, min: number, maxPageSize: number, rL: number): number => {
		const factory = {
			[RulerFactoryOption.Start]: () => index + 1,
			[RulerFactoryOption.End]: () => maxPageSize - rL + index + 1,
			[RulerFactoryOption.Default]: () => currentIndex + index - min,
		};
		return factory[this.getRulerOption(currentIndex, min, maxPageSize)]();
	};

	/**
	 * This is used to set ruler page array
	 * @param { number } currentIndex  The Current Index
	 * @param { number } maxPageSize   The Maximum page size
	 * @param { number } rulerLength The paginator rular length
	 * @returns { number[] } ruler array of page numbers.
	 */
	private getRuler = (currentIndex: number, maxPageSize: number, rulerLength: number): number[] => {
		const array = new Array(rulerLength).fill(null);
		const min = Math.floor(rulerLength / 2);
		return array.map((_, index) => this.getRulerFactory(currentIndex, index, min, maxPageSize, rulerLength));
	};
}
