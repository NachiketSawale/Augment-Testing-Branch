/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { EntityFilterProfileSaveOption } from '../../model';
import { ActivePopup } from '@libs/ui/common';

/**
 * Component for displaying and managing saved entity filters.
 */
@Component({
	selector: 'basics-shared-entity-filter-save-options',
	templateUrl: './entity-filter-save-options.component.html',
	styleUrl: './entity-filter-save-options.component.scss',
})
export class BasicsSharedEntityFilterSaveOptionsComponent {
	protected readonly activePopup = inject(ActivePopup);

	protected saveOptions = [
		{
			id: EntityFilterProfileSaveOption.AsChange,
			label: 'basics.material.lookup.filter.saveChanges',
		},
		{
			id: EntityFilterProfileSaveOption.AsCopy,
			label: 'basics.material.lookup.filter.saveAsCopy',
		},
	];

	protected select(option: EntityFilterProfileSaveOption) {
		this.activePopup.close({
			apply: true,
			value: option,
		});
	}
}
