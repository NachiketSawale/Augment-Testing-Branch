/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {Observable} from 'rxjs';

/**
 * Interface for popup view component
 */
export interface ILookupPopupView<TItem> {
	/**
	 * Focused data item
	 */
	focusedItem?: TItem;
	/**
	 * Selected data item
	 */
	selectedItem?: TItem;

	/**
	 * Load data
	 */
	load(): void;

	/**
	 * Search data
	 * @param input
	 */
	search(input: string): Observable<TItem | null | undefined>;

	/**
	 * Apply data item
	 * @param dataItem
	 */
	apply(dataItem: TItem): void;

	/**
	 * Go to previous item
	 */
	prev(): void;

	/**
	 * Go to next focused item
	 */
	next(): void;

	/**
	 * Resize popup
	 */
	resize(): void;

	/**
	 * Collapse selected tree node
	 */
	collapse?(): void;

	/**
	 * Expand selected tree node
	 */
	expand?(): void;

	/**
	 * Prepare async resource
	 */
	prepare?(): Promise<void>;
}

/**
 * Interface for lookup view result which will be applied in the lookup input
 */
export interface ILookupViewResult<TItem> {
	/**
	 * apply the result or not
	 */
	apply?: boolean;
	/**
	 * The result
	 */
	result?: TItem;
}

/**
 * Interface for grid view component
 */
export interface ILookupDialogView<TItem> {
	/**
	 * Current focused item
	 */
	focusedItem?: TItem;

	/**
	 * Refresh data
	 */
	refresh(): void;

	/**
	 * Apply data item
	 * @param dataItem
	 */
	apply(dataItem?: TItem): void;

	/**
	 * Can apply data item?
	 * @param dataItem
	 */
	canApply?(dataItem?: TItem): boolean;
}