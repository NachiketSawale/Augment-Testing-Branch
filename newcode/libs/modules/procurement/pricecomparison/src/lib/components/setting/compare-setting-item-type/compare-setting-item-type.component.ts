/*
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';
import { Translatable } from '@libs/platform/common';
import { FieldType, IGridConfiguration } from '@libs/ui/common';
import { ISimpleCheckableRowEntity } from '../../../model/entities/simple-checkable-row-entity.interface';
import { CompareGridUuids } from '../../../model/constants/compare-grid-uuids';
import { ProcurementPricecomparisonCompareSettingBaseComponent } from '../compare-setting-base/compare-setting-base.component';
import { ICompareItemSetting } from '../../../model/entities/item/compare-item-setting.interface';
import { ICompositeItemEntity } from '../../../model/entities/item/composite-item-entity.interface';

@Component({
	selector: 'procurement-pricecomparison-compare-setting-item-type',
	templateUrl: './compare-setting-item-type.component.html',
	styleUrls: ['./compare-setting-item-type.component.scss'],
})
export class ProcurementPricecomparisonCompareSettingItemTypeComponent extends ProcurementPricecomparisonCompareSettingBaseComponent<
	ICompositeItemEntity,
	ICompareItemSetting
> {
	public constructor() {
		super();
	}

	public itemTypeTitle: Translatable = {
		key: 'procurement.pricecomparison.itemItemTypeConfigTitle'
	};

	public itemType2Title: Translatable = {
		key: 'procurement.pricecomparison.itemItemType2ConfigTitle'
	};

	public itemTypeConfig: IGridConfiguration<ISimpleCheckableRowEntity> = {
		uuid: CompareGridUuids.item.itemType,
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

	public itemType2Config: IGridConfiguration<ISimpleCheckableRowEntity> = {
		uuid: CompareGridUuids.item.itemType2,
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

}
