/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, OnInit } from '@angular/core';
import { PropertyType } from '@libs/platform/common';
import { FieldType, IGridConfiguration, IMenuItemsList } from '@libs/ui/common';
import { ProcurementPricecomparisonCompareSettingBaseComponent } from '../compare-setting-base/compare-setting-base.component';
import { ICompositeBaseEntity } from '../../../model/entities/composite-base-entity.interface';
import { ICompareSettingBase } from '../../../model/entities/compare-setting-base.interface';
import { ICompareRowEntity } from '../../../model/entities/compare-row-entity.interface';
import {
	COMPARE_SETTING_GRID_STATE_OPTIONS_TOKEN,
	COMPARE_SETTING_GRID_UUID_BILLING_SCHEMA_FIELD_TOKEN
} from '../compare-setting-dialog-body/compare-setting-dialog-body.component';
import { ICompareGridStateOptions } from '../../../model/entities/compare-grid-state-options.interface';

@Component({
	selector: 'procurement-pricecomparison-compare-setting-billing-schema-field',
	templateUrl: './compare-setting-billing-schema-field.component.html',
	styleUrls: ['./compare-setting-billing-schema-field.component.scss'],
})
export class ProcurementPricecomparisonCompareSettingBillingSchemaFieldComponent<
	T extends ICompositeBaseEntity<T>,
	ST extends ICompareSettingBase<T>
> extends ProcurementPricecomparisonCompareSettingBaseComponent<T, ST> implements OnInit {
	public constructor() {
		super();
	}

	public ngOnInit(): void {
		this.gridStateOptions?.handleConfig(this.config);
	}

	private get gridStateOptions() {
		return this.injector.get<ICompareGridStateOptions<ICompareRowEntity>>(COMPARE_SETTING_GRID_STATE_OPTIONS_TOKEN, undefined, {
			optional: true
		});
	}

	public config: IGridConfiguration<ICompareRowEntity> = {
		uuid: this.injector.get<string>(COMPARE_SETTING_GRID_UUID_BILLING_SCHEMA_FIELD_TOKEN),
		skipPermissionCheck: true,
		entityRuntimeData: undefined, // TODO-DRIZZLE: To be checked.
		columns: this.createCompareColumns([{
			id: 'islive',
			model: 'IsLive',
			label: {
				text: 'Is Live',
				key: 'basics.customize.islive'
			},
			type: FieldType.Boolean,
			sortable: true,
			width: 150,
			readonly: true
		}]),
		items: this.settings.billingSchemaFields
	};

	public menu: IMenuItemsList = this.createMenuItemsList();

	public isFinalShowInTotalChanged(value: PropertyType) {
		this.settings.isFinalShowInTotal = value as boolean;
	}
}
