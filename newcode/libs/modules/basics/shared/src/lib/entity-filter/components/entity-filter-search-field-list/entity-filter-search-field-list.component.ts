/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, OnInit, inject } from '@angular/core';
import { IEntityIdentification } from '@libs/platform/common';
import { ActivePopup } from '@libs/ui/common';
import { EntityFilterScope, IEntityFilterSearchField } from '../../model';

/**
 * Component representing the entity filter search field list.
 *
 * @template TEntity - The type of the entity identification.
 */
@Component({
	selector: 'basics-shared-entity-filter-search-field-list',
	templateUrl: './entity-filter-search-field-list.component.html',
	styleUrl: './entity-filter-search-field-list.component.scss',
})
export class BasicsSharedEntityFilterSearchFieldListComponent<TEntity extends IEntityIdentification> implements OnInit {
	/**
	 * Injected instance of ActivePopup.
	 * @private
	 */
	private readonly activePopup = inject(ActivePopup);

	/**
	 * Injected instance of EntityFilterScope.
	 * @private
	 */
	private readonly scope = inject(EntityFilterScope<TEntity>);

	/**
	 * List of search fields.
	 * @public
	 */
	public readonly searchFields = this.scope.searchFields.map((e) => {
		return {
			...e,
		};
	});

	/**
	 * Reference to the "all" field in the search fields.
	 * @private
	 */
	private fieldAll = this.searchFields.find((e) => e.isAll);

	/**
	 * Initializes the component.
	 *
	 * @throws {Error} Throws an error if the search field extension is not provided.
	 */
	public async ngOnInit() {
		if (!this.scope.searchFieldExtension) {
			throw new Error('Search field extension is not provided');
		}
	}

	/**
	 * Toggles the selection state of a search field item.
	 *
	 * @param {IEntityFilterSearchField} item - The search field item to select or deselect.
	 */
	public select(item: IEntityFilterSearchField) {
		item.selected = !item.selected;

		if (this.fieldAll) {
			if (item === this.fieldAll) {
				if (item.selected) {
					this.searchFields.forEach((e) => {
						if (e !== this.fieldAll) {
							e.selected = false;
						}
					});
				}
			} else {
				if (item.selected) {
					this.fieldAll.selected = false;
				}
			}
		}

		this.activePopup.close({
			apply: true,
			value: this.searchFields,
		});
	}
}
