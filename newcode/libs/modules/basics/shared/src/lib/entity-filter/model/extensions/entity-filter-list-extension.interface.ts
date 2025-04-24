/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityFilterListItem, IEntityFilterDefinition } from '../interfaces';
import { InjectionToken } from '@angular/core';

/**
 * Interface representing the extension of an entity filter list.
 */
export interface IEntityFilterListExtension {
	/**
	 * Maps http data to an IEntityFilterListItem array.
	 *
	 * @param filterDef - The filter definition.
	 * @param data - The data to be mapped.
	 */
	mapData?(filterDef: IEntityFilterDefinition, data: unknown): IEntityFilterListItem[];

	/**
	 * Sets a predefined item in the list.
	 *
	 * @param filterDef - The filter definition.
	 * @param predefinedItem - The predefined item to be set.
	 */
	setPredefine?(filterDef: IEntityFilterDefinition, predefinedItem: IEntityFilterListItem): void;

	/**
	 * Resets a predefined item in the list.
	 *
	 * @param filterDef - The filter definition.
	 * @param item - The item to be reset.
	 */
	resetPredefine(filterDef: IEntityFilterDefinition, item: IEntityFilterListItem): void;
}

/**
 * The injection token
 */
export const ENTITY_FILTER_LIST_EXTENSION = new InjectionToken<IEntityFilterListExtension>('ENTITY_FILTER_LIST_EXTENSION');
