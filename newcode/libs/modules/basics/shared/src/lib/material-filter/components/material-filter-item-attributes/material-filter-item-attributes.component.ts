/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { ControlContextInjectionToken } from '@libs/ui/common';
import { IMaterialFilterItemAttributes, MATERIAL_FILTER_ITEM_ATTRIBUTES_OPTIONS_TOKEN } from '../../model';
import { IMaterialSearchEntity } from '../../../material-search';

/**
 * Material filter preview item attributes component
 */
@Component({
	selector: 'basics-shared-material-filter-item-attributes',
	templateUrl: './material-filter-item-attributes.component.html',
	styleUrl: './material-filter-item-attributes.component.scss'
})
export class BasicsSharedMaterialFilterItemAttributesComponent {
	private readonly controlContext = inject(ControlContextInjectionToken);
	private readonly options = inject(MATERIAL_FILTER_ITEM_ATTRIBUTES_OPTIONS_TOKEN);
	private _attributes: IMaterialFilterItemAttributes[] = [];

	/**
	 * Get attribute list
	 */
	public get attributeList() {
		const currentAttributes = this.getCurrentAttributes();

		if (this._attributes === currentAttributes || (!this._attributes?.length && !currentAttributes?.length)) {
			return this._attributes;
		}

		this._attributes = currentAttributes;
		return this._attributes;
	}

	private getCurrentAttributes() {
		const entity = this.controlContext.entityContext.entity as (IMaterialSearchEntity | undefined | null);
		return (entity ? (entity[this.options.Model] ?? []) : []);
	}
}