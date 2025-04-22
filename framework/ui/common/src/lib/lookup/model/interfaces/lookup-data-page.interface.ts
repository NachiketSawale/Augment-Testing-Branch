/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface ILookupDataPage<TEntity> {
	enabled: boolean;
	// current page
	index: number;
	// total page count
	length: number
	// page count
	pageCount: number;
	// total count
	totalCount: number;

	list?: TEntity[];

	next(): number;

	prev(): number;

	canNext(): boolean;

	canPrev(): boolean;

	setLength(value: number): void;

	resetLength(): void;

	getPageInfo(): string;

	getPageData(): TEntity[];
}