/*
 * Copyright(c) RIB Software GmbH
 */

import { IHighlightingItemEntity } from './highlighting-item-entity.interface';
import { IHighlightingSchemeEntity } from './highlighting-scheme-entity.interface';

/**
 * The full update object for a static highlighting scheme.
 */
export interface IStaticHlSchemeCompleteEntity {

	/**
	 * The highlighting scheme entity to save.
	 */
	StaticHlSchemes: IHighlightingSchemeEntity | null;

	/**
	 * Static highlighting items to save.
	 */
	StaticHlItemsToSave: IHighlightingItemEntity[] | null;

	/**
	 * Static highlighting items to delete.
	 */
	StaticHlItemsToDelete: IHighlightingItemEntity[] | null;
}
