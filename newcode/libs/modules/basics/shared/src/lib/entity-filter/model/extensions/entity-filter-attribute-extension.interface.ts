/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken } from '@angular/core';
import { IEntityFilterDefinition } from '../interfaces';
import { ILoadMoreListRequest, ILoadMoreListResponse } from '../../../load-more-list';

/**
 * Interface representing the extension of an entity filter attribute.
 */
export interface IEntityFilterAttributeExtension {
	/**
	 * Create attribute filter definition
	 * @param attribute
	 * @protected
	 */
	createAttributeFilterDef(attribute: string): IEntityFilterDefinition;

	/**
	 * Loads attributes based on the provided request.
	 *
	 * @param {ILoadMoreListRequest} request - The request containing parameters for loading more attributes.
	 * @returns {Promise<ILoadMoreListResponse<string>>} A promise that resolves to the response containing the loaded attributes.
	 */
	loadAttributes(request: ILoadMoreListRequest): Promise<ILoadMoreListResponse<string>>;
}

/**
 * The injection token
 */
export const ENTITY_FILTER_ATTRIBUTE_EXTENSION = new InjectionToken<IEntityFilterAttributeExtension>('ENTITY_FILTER_ATTRIBUTE_EXTENSION');
