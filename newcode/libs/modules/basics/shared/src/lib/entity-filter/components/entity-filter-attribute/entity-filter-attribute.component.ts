/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { ActivePopup } from '@libs/ui/common';
import { EntityFilterScope } from '../../model';
import { IEntityIdentification } from '@libs/platform/common';
import { ILoadMoreListProvider, ILoadMoreListRequest } from '../../../load-more-list';

/**
 * Component for entity filter attribute.
 */
@Component({
	selector: 'basics-shared-entity-filter-attribute',
	templateUrl: './entity-filter-attribute.component.html',
	styleUrl: './entity-filter-attribute.component.scss',
})
export class BasicsSharedEntityFilterAttributeComponent<TEntity extends IEntityIdentification> {
	private readonly activePopup = inject(ActivePopup);
	public readonly scope = inject(EntityFilterScope<TEntity>);

	/**
	 * Constructor for BasicsSharedEntityFilterAttributeComponent.
	 * Throws an error if the attribute extension is not provided.
	 */
	public constructor() {
		if (!this.scope.attributeExtension) {
			throw new Error('Attribute extension not provided');
		}
	}

	/**
	 * Data provider for loading more list items.
	 *
	 * @type {ILoadMoreListProvider<string>}
	 */
	public dataProvider: ILoadMoreListProvider<string> = {
		/**
		 * Fetches more attributes based on the provided request.
		 *
		 * @param {ILoadMoreListRequest} request - The request containing parameters for loading more attributes.
		 * @returns {Promise<ILoadMoreListResponse<string>>} A promise that resolves to the response containing the loaded attributes.
		 */
		fetch: (request: ILoadMoreListRequest) => this.scope.attributeExtension!.loadAttributes(request),

		/**
		 * Selects an item and closes the active popup with the selected item.
		 *
		 * @param {string} item - The selected item.
		 */
		select: (item) => this.activePopup.close({ apply: true, value: item }),

		/**
		 * Formats an item into a string representation.
		 *
		 * @param {string} item - The item to be formatted.
		 * @returns {string} The string representation of the item.
		 */
		format: (item) => item,
	};
}
