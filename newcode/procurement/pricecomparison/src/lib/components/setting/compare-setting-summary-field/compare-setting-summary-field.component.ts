/*
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';
import { PropertyType, Translatable } from '@libs/platform/common';
import { FieldType, IGridConfiguration } from '@libs/ui/common';
import { ProcurementPricecomparisonCompareSettingBaseComponent } from '../compare-setting-base/compare-setting-base.component';
import { ICompositeBoqEntity } from '../../../model/entities/boq/composite-boq-entity.interface';
import { ICompareBoqSetting } from '../../../model/entities/boq/compare-boq-setting.interface';
import { ISimpleCheckableRowEntity } from '../../../model/entities/simple-checkable-row-entity.interface';
import { CompareGridUuids } from '../../../model/constants/compare-grid-uuids';

@Component({
	selector: 'procurement-pricecomparison-compare-setting-summary-field',
	templateUrl: './compare-setting-summary-field.component.html',
	styleUrls: ['./compare-setting-summary-field.component.scss'],
})
export class ProcurementPricecomparisonCompareSettingSummaryFieldComponent extends ProcurementPricecomparisonCompareSettingBaseComponent<
	ICompositeBoqEntity,
	ICompareBoqSetting
> {
	public constructor() {
		super();
	}

	public structureTitle: Translatable = {
		key: 'procurement.pricecomparison.showSummary'
	};

	public boqItemTypeTitle: Translatable = {
		key: 'procurement.pricecomparison.boqItemTypeConfigTitle'
	};

	public boqItemType2Title: Translatable = {
		key: 'procurement.pricecomparison.boqItemType2ConfigTitle'
	};

	public structureConfig: IGridConfiguration<ISimpleCheckableRowEntity> = {
		uuid: CompareGridUuids.boq.summaryStructure,
		skipPermissionCheck: true,
		entityRuntimeData: undefined, // TODO-DRIZZLE: To be checked.
		columns: [{
			id: 'IsChecked',
			model: 'IsChecked',
			label: {
				text: 'All',
				key: 'procurement.pricecomparison.printing.All'
			},
			type: FieldType.Boolean,
			width: 60,
			sortable: true,
			headerChkbox: true
		}, {
			id: 'description',
			model: 'DescriptionInfo.Translated',
			label: {
				text: 'Type',
				key: 'cloud.common.entityDescription'
			},
			type: FieldType.Description,
			width: 180,
			sortable: true,
			searchable: true
		}],
		items: this.settings.structures
	};

	public boqItemTypeConfig: IGridConfiguration<ISimpleCheckableRowEntity> = {
		uuid: CompareGridUuids.boq.summaryBoqItemType,
		skipPermissionCheck: true,
		entityRuntimeData: undefined, // TODO-DRIZZLE: To be checked.
		columns: [{
			id: 'IsChecked',
			model: 'IsChecked',
			label: {
				text: 'All',
				key: 'procurement.pricecomparison.printing.All'
			},
			type: FieldType.Boolean,
			width: 60,
			sortable: true,
			headerChkbox: true
		}, {
			id: 'description',
			model: 'DescriptionInfo.Translated',
			label: {
				text: 'Type',
				key: 'cloud.common.entityDescription'
			},
			type: FieldType.Description,
			width: 180,
			sortable: true,
			searchable: true
		}, {
			id: 'userFieldName',
			model: 'UserLabelName',
			label: {
				text: 'User label name',
				key: 'cloud.desktop.formConfigCustomerLabelName'
			},
			type: FieldType.Description,
			width: 150,
			sortable: true
		}],
		items: this.settings.itemTypes
	};

	public boqItemType2Config: IGridConfiguration<ISimpleCheckableRowEntity> = {
		uuid: CompareGridUuids.boq.summaryBoqItemType2,
		skipPermissionCheck: true,
		entityRuntimeData: undefined, // TODO-DRIZZLE: To be checked.
		columns: [{
			id: 'IsChecked',
			model: 'IsChecked',
			label: {
				text: 'All',
				key: 'procurement.pricecomparison.printing.All'
			},
			type: FieldType.Boolean,
			width: 60,
			sortable: true,
			headerChkbox: true
		}, {
			id: 'description',
			model: 'DescriptionInfo.Translated',
			label: {
				text: 'Type',
				key: 'cloud.common.entityDescription'
			},
			type: FieldType.Description,
			width: 180,
			sortable: true,
			searchable: true
		}, {
			id: 'userFieldName',
			model: 'UserLabelName',
			label: {
				text: 'User label name',
				key: 'cloud.desktop.formConfigCustomerLabelName'
			},
			type: FieldType.Description,
			width: 150,
			sortable: true
		}],
		items: this.settings.itemTypes2
	};

	public isHideZeroValueLinesChanged(value: PropertyType) {
		this.settings.isHideZeroValueLines = value as boolean;
	}

	public isPercentageLevelsChanged(value: PropertyType) {
		this.settings.isPercentageLevels = value as boolean;
	}
}
