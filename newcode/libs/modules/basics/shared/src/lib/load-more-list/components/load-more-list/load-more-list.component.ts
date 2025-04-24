/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Input, OnInit } from '@angular/core';
import { ILoadMoreListProvider, ILoadMoreListRequest } from '../../model';

/**
 * A component for loading more items in a list.
 */
@Component({
	selector: 'basics-shared-load-more-list',
	templateUrl: './load-more-list.component.html',
	styleUrl: './load-more-list.component.scss',
})
export class BasicsSharedLoadMoreListComponent<T> implements OnInit {
	/**
	 * The provider for loading more items.
	 * @private
	 * @type {ILoadMoreListProvider<T>}
	 */
	@Input()
	public dataProvider!: ILoadMoreListProvider<T>;

	/**
	 * The request object containing pagination and filtering information.
	 * @type {ILoadMoreListRequest}
	 */
	public request: ILoadMoreListRequest = {
		pageNumber: 1,
		pageSize: 100,
		userInput: '',
	};

	public async ngOnInit() {
		if (this.dataProvider.pageSize) {
			this.request.pageSize = this.dataProvider.pageSize;
		}
		await this.load();
	}

	/**
	 * The loaded items.
	 * @type {T[]}
	 */
	public items: T[] = [];

	/**
	 * Indicates whether the list is currently loading more items.
	 * @type {boolean}
	 */
	public loading: boolean = false;

	/**
	 * Indicates whether there are more items to load.
	 * @type {boolean}
	 */
	public hasMore: boolean = false;

	/**
	 * Indicates whether to show a hint when there are no more items to load.
	 * @type {boolean}
	 */
	public showNoMoreHint = false;

	/**
	 * Searches for items and resets the list.
	 * @async
	 * @returns {Promise<void>}
	 */
	public async search(): Promise<void> {
		this.items = [];
		this.request.pageNumber = 1;
		await this.load();
	}

	/**
	 * Loads more items and appends them to the list.
	 * @async
	 * @returns {Promise<void>}
	 */
	public async loadMore(): Promise<void> {
		this.request.pageNumber++;
		await this.load();

		if (!this.hasMore) {
			this.showNoMoreHint = true;
			setTimeout(() => {
				this.showNoMoreHint = false;
			}, 2000);
		}
	}

	/**
	 * Loads items based on the current request.
	 * @private
	 * @async
	 * @returns {Promise<void>}
	 */
	private async load(): Promise<void> {
		this.loading = true;
		const res = await this.dataProvider.fetch(this.request);
		this.hasMore = res.hasMore;
		this.items = this.items.concat([...new Set(res.items)]);
		this.loading = false;
	}

	/**
	 * Selects an item from the list.
	 *
	 * @param {T} item - The item to be selected.
	 */
	public select(item: T): void {
		this.dataProvider.select(item);
	}

	/**
	 * Formats an item to be displayed in the list.
	 * @param item - The item to be formatted.
	 */
	public format(item: T): string {
		return this.dataProvider.format(item);
	}
}
