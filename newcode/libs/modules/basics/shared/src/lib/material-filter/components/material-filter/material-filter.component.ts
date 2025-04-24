/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Input } from '@angular/core';
import { BasicsSharedMaterialFilterService } from '../../services';
import { IMaterialFilterInput, MaterialFilterListExtension, MaterialFilterScope, MaterialFilterSearchFieldExtension } from '../../model';
import { BasicsSharedMaterialFilterTranslatePipe } from '../../pipes';
import { ENTITY_FILTER_ATTRIBUTE_EXTENSION, ENTITY_FILTER_LIST_EXTENSION, ENTITY_FILTER_SEARCH_FIELD_EXTENSION } from '../../../entity-filter';
import { MaterialAttributeFilterExtension } from '../../model';

/**
 * Material filter component
 */
@Component({
	selector: 'basics-shared-material-filter',
	templateUrl: './material-filter.component.html',
	styleUrl: './material-filter.component.scss',
	providers: [
		BasicsSharedMaterialFilterTranslatePipe,
		{
			provide: ENTITY_FILTER_ATTRIBUTE_EXTENSION,
			useClass: MaterialAttributeFilterExtension,
		},
		{
			provide: ENTITY_FILTER_LIST_EXTENSION,
			useClass: MaterialFilterListExtension,
		},
		{
			provide: ENTITY_FILTER_SEARCH_FIELD_EXTENSION,
			useClass: MaterialFilterSearchFieldExtension,
		},
	],
})
export class BasicsSharedMaterialFilterComponent {
	/**
	 * Scope, shared in all subcomponents of material filter view
	 */
	public scope = new MaterialFilterScope();

	/**
	 * Search service setter, default is BasicsSharedMaterialFilterService in scope property
	 * It is allowed to extend default filter service
	 */
	@Input()
	public set filterService(value: BasicsSharedMaterialFilterService | null | undefined) {
		if (value) {
			this.scope.filterService = value;
		}
	}

	/**
	 * Filter input setter
	 */
	@Input()
	public set filterInput(value: Partial<IMaterialFilterInput> | null | undefined) {
		if (value) {
			this.scope.input = {
				...this.scope.input,
				...value,
			};
		}
	}

	/**
	 * initialization
	 */
	public ngOnInit() {
		this.scope.translateService.load(['basics.material']);
	}
}
