/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { ActivePopup } from '@libs/ui/common';
import { IEntityFilterDefinition, EntityFilterScope } from '../../model';
import { IEntityIdentification } from '@libs/platform/common';

/**
 * Entity filter selection component
 */
@Component({
	selector: 'basics-shared-entity-filter-selection',
	templateUrl: './entity-filter-selection.component.html',
	styleUrl: './entity-filter-selection.component.scss',
})
export class BasicsSharedEntityFilterSelectionComponent<TEntity extends IEntityIdentification> {
	private readonly activePopup = inject(ActivePopup);
	public readonly scope = inject(EntityFilterScope<TEntity>);

	/**
	 * User input for filter search
	 */
	public userInput: string = '';

	/**
	 * Gets the available filters
	 */
	public get availableFilters(): IEntityFilterDefinition[] {
		return this.scope.filterDefs;
	}

	/**
	 * Gets the pinned filter items
	 */
	public get pinnedItems() {
		return this.availableFilters.filter((e) => e.IsPinned);
	}

	/**
	 * Gets the filter items based on user input
	 */
	public get items() {
		let defs = this.availableFilters.filter((e) => !e.IsPinned);

		if (this.userInput) {
			defs = defs.filter((e) => e.Id.toLowerCase().includes(this.userInput.toLowerCase()));
		}

		return defs;
	}

	/**
	 * Tracks items by their Id
	 * @param index The index of the item
	 * @param item The filter definition item
	 */
	public trackById(index: number, item: IEntityFilterDefinition) {
		return item.Id;
	}

	/**
	 * Selects a filter item and closes the popup
	 * @param item The selected filter definition item
	 */
	public select(item: IEntityFilterDefinition) {
		this.activePopup.close({
			apply: true,
			value: item,
		});
	}
}
