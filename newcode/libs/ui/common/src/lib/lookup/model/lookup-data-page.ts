/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {ILookupDataPage} from './interfaces/lookup-data-page.interface';

export class LookupDataPage<TEntity> implements ILookupDataPage<TEntity> {
	private $list?: TEntity[];

	public enabled = false;
	// current page
	public index = 0;
	// total page count
	public length = 0;
	// page count
	public pageCount = 100;
	// total count
	public totalCount = 0;

	public get list() {
		return this.$list;
	}

	public set list(list: TEntity[] | undefined) {
		this.$list = list;
		this.resetLength();
		if (list) {
			this.setLength(list.length);
		} else {
			this.setLength(0);
		}
	}

	public next(): number {
		return ++this.index;
	}

	public prev(): number {
		return --this.index;
	}

	public canNext(): boolean {
		return this.index < this.length - 1;
	}

	public canPrev(): boolean {
		return this.index > 0;
	}

	public setLength(value: number) {
		this.totalCount = value;
		this.length = Math.ceil(value / this.pageCount);
	}

	public resetLength() {
		this.index = 0;
		this.length = 0;
		this.totalCount = 0;
	}

	public getPageInfo(): string {
		if (this.totalCount > 0) {
			const range = this.range();
			return `${range[0] + 1}-${range[1]}/${this.totalCount}`;
		}
		return '0-0/0';
	}

	public getPageData() {
		if (!this.list) {
			throw new Error('list is null');
		}

		const range = this.range();
		return this.list.slice(range[0], range[1]);
	}

	private range() {
		const start = this.pageCount * this.index;
		let end = (this.index + 1) * this.pageCount;
		if (end > this.totalCount) {
			end = this.totalCount;
		}
		return [start, end];
	}
}