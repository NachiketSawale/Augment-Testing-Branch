/*
 * Copyright(c) RIB Software GmbH
 */

import { ElementRef } from '@angular/core';
import { IEntityContext } from '@libs/platform/common';

import { ILookupConfig } from './lookup-options.interface';
import { ILookupIdentificationData } from './lookup-identification-data.interface';

/**
 * Lookup input interface
 */
export interface ILookupInput<TItem extends object, TEntity extends object> {
	/**
	 * The input element
	 */
	input?: ElementRef;
	/**
	 * The input value
	 */
	inputValue?: string;
	/**
	 * Lookup config
	 */
	config: ILookupConfig<TItem, TEntity>;
	/**
	 * Entity context
	 */
	effectiveEntityContext: IEntityContext<TEntity>;
	/**
	 * Selected lookup item
	 */
	selectedItem?: TItem | null;

	/**
	 * Get id of selected lookup item
	 */
	getSelectedId(): ILookupIdentificationData | null;

	/**
	 * Apply lookup item
	 * @param item
	 */
	apply(item: TItem): void;

	/**
	 * Clear value
	 */
	clear(): void;
}