/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { Translatable } from '@libs/platform/common';
import { createLookup, FieldType, IGridConfiguration, } from '@libs/ui/common';
import { ProcurementPricecomparisonCompareSettingBaseComponent } from '../compare-setting-base/compare-setting-base.component';
import { ICompositeBoqEntity } from '../../../model/entities/boq/composite-boq-entity.interface';
import { ICompareBoqRangeEntity, ICompareBoqSetting } from '../../../model/entities/boq/compare-boq-setting.interface';
import { COMPARE_SETTING_GRID_UUID_BOQ_RANGE_TOKEN, COMPARE_SETTINGS_BOQ_RANGE_DATA_TOEKN, } from '../compare-setting-dialog-body/compare-setting-dialog-body.component';

@Component({
	selector: 'procurement-pricecomparison-compare-setting-boq-range',
	templateUrl: './compare-setting-boq-range.component.html',
	styleUrls: ['./compare-setting-boq-range.component.scss'],
})
export class ProcurementPricecomparisonCompareSettingBoqRangeComponent extends ProcurementPricecomparisonCompareSettingBaseComponent<
	ICompositeBoqEntity,
	ICompareBoqSetting
> {
	public constructor() {
		super();
	}

	private get uuid() {
		return inject<string>(COMPARE_SETTING_GRID_UUID_BOQ_RANGE_TOKEN);
	}

	private get currGrid() {
		return this.gridApiSvc.get<ICompareBoqRangeEntity>(this.uuid);
	}

	public title: Translatable = {
		key: 'procurement.pricecomparison.printing.BoqRange'
	};

	public config: IGridConfiguration<ICompareBoqRangeEntity> = {
		uuid: this.uuid,
		skipPermissionCheck: true,
		entityRuntimeData: undefined, // TODO-DRIZZLE: To be checked.
		columns: [{
			id: 'reference',
			model: 'Reference',
			label: {
				text: 'Reference',
				key: 'procurement.pricecomparison.printing.Reference'
			},
			type: FieldType.Description,
			sortable: false,
			searchable: true,
			width: 100
		}, {
			id: 'briefinfo',
			model: 'Brief',
			label: {
				text: 'Brief Info',
				key: 'procurement.pricecomparison.printing.BriefInfo'
			},
			type: FieldType.Description,
			sortable: false,
			searchable: true,
			width: 150
		}, {
			id: 'referencefrom',
			model: 'BoqHeaderFkFrom',
			label: {
				text: 'From',
				key: 'procurement.pricecomparison.printing.From'
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({}),
			width: 300,
			sortable: false
		}, {
			id: 'referenceto',
			model: 'BoqHeaderFkTo',
			label: {
				text: 'To',
				key: 'procurement.pricecomparison.printing.To'
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({}),
			width: 300,
			sortable: false
		}],
		items: inject<ICompareBoqRangeEntity[]>(COMPARE_SETTINGS_BOQ_RANGE_DATA_TOEKN)
	};
}
