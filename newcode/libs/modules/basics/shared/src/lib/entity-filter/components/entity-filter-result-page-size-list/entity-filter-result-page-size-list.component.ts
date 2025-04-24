/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { ENTITY_FILTER_RESULT_PAGINATION_INFO } from '../../model';
import { ActivePopup } from '@libs/ui/common';

/**
 * Entity Filter Result Pagination Page Size List Component
 */
@Component({
	selector: 'basics-shared-entity-filter-result-page-size-list',
	templateUrl: './entity-filter-result-page-size-list.component.html',
	styleUrl: './entity-filter-result-page-size-list.component.scss'
})
export class BasicsSharedEntityFilterResultPageSizeListComponent {

	/**
	 * Injected instance of ActivePopup.
	 * @private
	 */
	private readonly activePopup = inject(ActivePopup);

	/**
	 * Injected instance of pagination info
	 * @private
	 */
	public info = inject(ENTITY_FILTER_RESULT_PAGINATION_INFO);

	/**
	 * Select page size
	 * @param selectedPageSize
	 */
	public select(selectedPageSize: number) {
		this.activePopup.close({
			apply: true,
			value: selectedPageSize
		});
	}
}