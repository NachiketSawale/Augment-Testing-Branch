/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, OnInit } from '@angular/core';
import { FieldType, IGridConfiguration, IMenuItemsList } from '@libs/ui/common';
import { ProcurementPricecomparisonCompareSettingBaseComponent } from '../compare-setting-base/compare-setting-base.component';
import { ICompositeBaseEntity } from '../../../model/entities/composite-base-entity.interface';
import { ICompareSettingBase } from '../../../model/entities/compare-setting-base.interface';
import { ICompareRowEntity } from '../../../model/entities/compare-row-entity.interface';
import {
	COMPARE_SETTING_GRID_STATE_OPTIONS_TOKEN,
	COMPARE_SETTING_GRID_UUID_QUOTE_FIELD_TOKEN
} from '../compare-setting-dialog-body/compare-setting-dialog-body.component';
import { ICompareGridStateOptions } from '../../../model/entities/compare-grid-state-options.interface';

@Component({
	selector: 'procurement-pricecomparison-compare-setting-quote-field',
	templateUrl: './compare-setting-quote-field.component.html',
	styleUrls: ['./compare-setting-quote-field.component.scss'],
})
export class ProcurementPricecomparisonCompareSettingQuoteFieldComponent<
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
		uuid: this.injector.get<string>(COMPARE_SETTING_GRID_UUID_QUOTE_FIELD_TOKEN),
		skipPermissionCheck: true,
		entityRuntimeData: undefined, // TODO-DRIZZLE: To be checked.
		columns: this.createCompareColumns([{
			id: 'isSorting',
			model: 'IsSorting',
			label: {
				text: 'Sorting',
				key: 'procurement.pricecomparison.isSorting'
			},
			type: FieldType.Boolean,
			sortable: true,
			width: 100
		}]),
		items: this.settings.quoteFields
	};

	public menu: IMenuItemsList = this.createMenuItemsList();
}
