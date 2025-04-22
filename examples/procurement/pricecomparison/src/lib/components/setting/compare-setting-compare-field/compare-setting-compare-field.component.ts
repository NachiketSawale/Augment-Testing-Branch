/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, OnInit } from '@angular/core';
import { PropertyType } from '@libs/platform/common';
import { createLookup, FieldType, IGridConfiguration, IMenuItemsList } from '@libs/ui/common';
import { BasicsSharedProcurementItemEvaluationLookupService } from '@libs/basics/shared';
import { ProcurementPricecomparisonCompareSettingBaseComponent } from '../compare-setting-base/compare-setting-base.component';
import { ICompositeBaseEntity } from '../../../model/entities/composite-base-entity.interface';
import { ICompareSettingBase } from '../../../model/entities/compare-setting-base.interface';
import { ICompareRowEntity } from '../../../model/entities/compare-row-entity.interface';
import { ProcurementPricecomparisonItemEvaluationFilterService } from '../../../filters/item-evaluation-filter.service';
import {
	COMPARE_SETTING_GRID_STATE_OPTIONS_TOKEN,
	COMPARE_SETTING_GRID_UUID_COMPARE_FIELD_TOKEN
} from '../compare-setting-dialog-body/compare-setting-dialog-body.component';
import { ICompareGridStateOptions } from '../../../model/entities/compare-grid-state-options.interface';

@Component({
	selector: 'procurement-pricecomparison-compare-setting-compare-field',
	templateUrl: './compare-setting-compare-field.component.html',
	styleUrls: ['./compare-setting-compare-field.component.scss'],
})
export class ProcurementPricecomparisonCompareSettingCompareFieldComponent<
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
		uuid: this.injector.get<string>(COMPARE_SETTING_GRID_UUID_COMPARE_FIELD_TOKEN),
		skipPermissionCheck: true,
		entityRuntimeData: undefined, // TODO-DRIZZLE: To be checked.
		columns: this.createCompareColumns([{
			id: 'showInSummary',
			model: 'ShowInSummary',
			label: {
				text: 'Show In Summary',
				key: 'procurement.pricecomparison.compareConfigFieldsShowInSummary'
			},
			type: FieldType.Boolean,
			sortable: true,
			headerChkbox: true
		}, {
			id: 'leadingField',
			model: 'IsLeading',
			label: {
				text: 'Leading Field',
				key: 'procurement.pricecomparison.compareConfigFieldsLeadingField'
			},
			type: FieldType.Boolean,
			sortable: true
		}, {
			id: 'allowEdit',
			model: 'AllowEdit',
			label: {
				text: 'Allow Edit',
				key: 'procurement.pricecomparison.compareConfigFieldsAllowEdit'
			},
			type: FieldType.Boolean,
			sortable: true,
			headerChkbox: true
		}, {
			id: 'conditionalFormat',
			model: 'ConditionalFormat',
			label: {
				text: 'Conditional Format',
				key: 'procurement.pricecomparison.compareConfigFieldsConditionalFormat'
			},
			type: FieldType.Text,
			sortable: true,
			readonly: true,
			width: 500
		}, {
			id: 'deviationField',
			model: 'DeviationField',
			label: {
				text: 'Deviation Field',
				key: 'procurement.pricecomparison.deviationField'
			},
			type: FieldType.Boolean,
			width: 100,
			sortable: true,
			searchable: true,
			headerChkbox: true
		}, {
			id: 'deviationPercent',
			model: 'DeviationPercent',
			label: {
				text: 'Deviation Percent',
				key: 'procurement.pricecomparison.deviationPercent'
			},
			type: FieldType.Percent,
			width: 100,
			sortable: true,
			//regex: '(^[+]?\\d*$)|(^(?:[+]?[\\d]*(?:[,\\.]{0,1}\\d+)*)([,\\.][\\d]{0,2})$)' TODO-DRIZZLE: To be checked.
		}, {
			id: 'deviationReference',
			model: 'DeviationReference',
			label: {
				text: 'Deviation Reference',
				key: 'procurement.pricecomparison.deviationReference'
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedProcurementItemEvaluationLookupService,
				displayMember: 'DescriptionInfo.Translated',
				clientSideFilterToken: ProcurementPricecomparisonItemEvaluationFilterService
			}),
			sortable: true,
			searchable: true
		}]),
		items: this.settings.compareFields
	};

	public menu: IMenuItemsList = this.createMenuItemsList([
		this.createMenuItem('settings', 'cloud.common.toolbarSetting', ' tlb-icons ico-settings-doc', 1, () => {
			// TODO-DRIZZLE: To be checked.
		})
	]);

	public isVerticalCompareRowsChanged(value: PropertyType) {
		this.settings.isVerticalCompareRows = value as boolean;
		// TODO-DRIZZLE:To be checked.
	}

	public isLineValueColumnChanged(value: PropertyType) {
		this.settings.isShowLineValueColumn = value as boolean;
		// TODO-DRIZZLE:To be checked.
	}
}
