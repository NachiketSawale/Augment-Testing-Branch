/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * Sync data page.
 */
export class SyncDataPage {
	public enabled = false;
	// current page
	public index = 0;
	// total page count
	public length = 0;
	// page count
	public pageCount = 200;
	// total count
	public totalCount = 0;

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

	public getPageInfo(): string {
		if (this.totalCount > 0) {
			const range = this.range();
			return `${range[0] + 1}-${range[1]}/${this.totalCount}`;
		}
		return '0-0/0';
	}

	public range() {
		const start = this.pageCount * this.index;
		let end = (this.index + 1) * this.pageCount;
		if (end > this.totalCount) {
			end = this.totalCount;
		}
		return [start, end];
	}
}
