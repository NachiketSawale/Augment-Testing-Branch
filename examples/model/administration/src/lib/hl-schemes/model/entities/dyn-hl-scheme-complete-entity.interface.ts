/*
 * Copyright(c) RIB Software GmbH
 */

import { IHighlightingItemEntity } from './highlighting-item-entity.interface';
import { IHighlightingSchemeEntity } from './highlighting-scheme-entity.interface';

/**
 * The full update object for a dynamic highlighting scheme.
 */
export interface IDynHlSchemeCompleteEntity {

	/**
	 * The highlighting scheme entity to save.
	 */
	DynHlSchemes: IHighlightingSchemeEntity | null;

	/**
	 * Dynamic highlighting items to save.
	 */
	DynHlItemsToSave: IHighlightingItemEntity[] | null;

	/**
	 * Dynamic highlighting items to delete.
	 */
	DynHlItemsToDelete: IHighlightingItemEntity[] | null;
}
