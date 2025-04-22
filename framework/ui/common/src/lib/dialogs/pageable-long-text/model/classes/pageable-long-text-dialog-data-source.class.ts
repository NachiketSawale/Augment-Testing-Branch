/*
 * Copyright(c) RIB Software GmbH
 */
import { PageableLongTextDialogCallback } from '../pageable-long-text-dialog-call-back.type';
import { IPageableLongTextDialogData } from '../interfaces/pageable-long-text-dialog-data.interface';

/**
 * Data source with pagination.
 */
export class PageableLongTextDialogDataSource {
	/**
	 * Current page index number.
	 */
	private currentPageIndex: number = 0;

	/**
	 * Total number of pages.
	 */
	private totalPageCount: number = 0;

	/**
	 * Current data.
	 */
	private _currentText!: string;

	/**
	 * Is data still being retrieved.
	 */
	public isPaginating: boolean = false;

	public constructor(
		data: IPageableLongTextDialogData,
		private callBackFn: PageableLongTextDialogCallback,
	) {
		this._currentText = data.text;
		this.totalPageCount = data.totalPageCount ? data.totalPageCount : this.totalPageCount;
	}

	/**
	 * Returns the current page data.
	 */
	public get currentText(): string {
		return this._currentText;
	}

	/**
	 * Loads the data for the given index using call back.
	 *
	 * @param index Index of the page to be loaded.
	 */
	private async loadPage(index: number): Promise<void> {
		const data = await this.callBackFn(index, false);
		this._currentText = data.text;
		this.currentPageIndex = index;
		return Promise.resolve();
	}

	/**
	 * Loads data for previous page index.
	 */
	public loadPreviousPage(): Promise<void> {
		if (this.currentPageIndex > 0) {
			return this.loadPage(this.currentPageIndex - 1);
		}
		return Promise.resolve();
	}

	/**
	 * Loads data for the next page index.
	 */
	public loadNextPage(): Promise<void> {
		if (this.currentPageIndex < this.totalPageCount - 1) {
			return this.loadPage(this.currentPageIndex + 1);
		}
		return Promise.resolve();
	}

	/**
	 * Checks if previous page present.
	 *
	 * @returns Is previous page available.
	 */
	public hasPreviousPage(): boolean {
		return this.currentPageIndex > 0;
	}

	/**
	 * Checks if next page present.
	 *
	 * @returns Is next page available.
	 */
	public hasNextPage(): boolean {
		return this.currentPageIndex < this.totalPageCount - 1;
	}
}
