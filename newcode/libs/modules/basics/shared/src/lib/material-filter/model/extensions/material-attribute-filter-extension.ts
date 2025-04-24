/*
 * Copyright(c) RIB Software GmbH
 */

import { inject } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import { ILoadMoreListRequest, ILoadMoreListResponse } from '../../../load-more-list';
import { EntityFilterSource, EntityFilterType, IEntityFilterAttributeExtension, IEntityFilterDefinition } from '../../../entity-filter';

/**
 * Material attribute filter extension
 */
export class MaterialAttributeFilterExtension implements IEntityFilterAttributeExtension {
	private readonly httpService = inject(PlatformHttpService);

	/**
	 * Creates an attribute filter definition.
	 *
	 * @param {string} attribute - The attribute to create the filter definition for.
	 * @returns {IEntityFilterDefinition} The created attribute filter definition.
	 */
	public createAttributeFilterDef(attribute: string): IEntityFilterDefinition {
		return {
			Id: attribute,
			Source: EntityFilterSource.Attribute,
			Type: EntityFilterType.List,
			ListEndpoint: {
				UsePost: true,
				Url: 'basics/material/filter/propertyValues',
				Payload: {
					Property: attribute,
				},
			},
		};
	}

	/**
	 * Loads attributes based on the provided request.
	 *
	 * @param {ILoadMoreListRequest} request - The request containing parameters for loading more attributes.
	 * @returns {Promise<ILoadMoreListResponse<string>>} A promise that resolves to the response containing the loaded attributes.
	 */
	public async loadAttributes(request: ILoadMoreListRequest): Promise<ILoadMoreListResponse<string>> {
		const data = await this.httpService.post<string[]>('basics/material/filter/properties', request);
		return {
			hasMore: data.length === request.pageSize,
			items: data,
		};
	}
}
