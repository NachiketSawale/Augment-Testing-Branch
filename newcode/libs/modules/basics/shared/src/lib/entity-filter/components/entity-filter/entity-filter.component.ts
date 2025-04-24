/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Input } from '@angular/core';
import { IEntityIdentification } from '@libs/platform/common';
import { EntityFilterScope } from '../../model';

/**
 * Entity Filter Component
 */
@Component({
	selector: 'basics-shared-entity-filter',
	templateUrl: './entity-filter.component.html',
	styleUrl: './entity-filter.component.scss'
})
export class BasicsSharedEntityFilterComponent<TEntity extends IEntityIdentification> {
	/**
	 * Filter scope
	 * The scope defines the context in which the filters are applied.
	 */
	@Input()
	public scope!: EntityFilterScope<TEntity>;
}