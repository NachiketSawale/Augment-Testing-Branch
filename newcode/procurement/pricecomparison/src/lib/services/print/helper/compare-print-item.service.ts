/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import _ from 'lodash';
import { ComparePrintServiceBase } from '../../../model/entities/print/compare-print-service-base.class';
import { ICompositeItemEntity } from '../../../model/entities/item/composite-item-entity.interface';
import { ICompareItemTreeResponse } from '../../../model/entities/item/compare-item-tree-response.interface';
import { ProcurementPricecomparisonComparePrintItemDataService } from '../data/compare-print-item-data.service';
import { IComparePrintGenericProfile, IComparePrintRowBase } from '../../../model/entities/print/compare-print-generic-profile.interface';
import { CompareGridColumn } from '../../../model/entities/compare-grid-column.interface';
import { ProcurementPricecomparisonCompareItemDataService } from '../../data/item/compare-item-data.service';
import { ProcurementPricecomparisonComparePrintItemSettingService } from '../setting/compare-print-item-setting.service';
import { IComparePrintTemplateData } from '../../../model/entities/print/compare-print-template-data.interface';
import { IComparePrintContext } from '../../../model/entities/print/compare-print-context.interface';
import { IComparePrintAdditionalInfo } from '../../../model/entities/print/compare-print-additional-info.interface';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPricecomparisonComparePrintItemService extends ComparePrintServiceBase<
	ICompositeItemEntity,
	ICompareItemTreeResponse
> {
	protected constructor(
		private itemDataSvc: ProcurementPricecomparisonCompareItemDataService,
		private itemPrintDataSvc: ProcurementPricecomparisonComparePrintItemDataService,
		private itemPrintSettingSvc: ProcurementPricecomparisonComparePrintItemSettingService
	) {
		super(itemDataSvc, itemPrintDataSvc, itemPrintSettingSvc);
	}

	protected getPrintName(): string {
		return 'item-price-comparison';
	}

	protected getPrintType(): string {
		return 'item';
	}

	protected getPrintColumns(generic: IComparePrintGenericProfile, defaultColumns: CompareGridColumn<ICompositeItemEntity>[]): CompareGridColumn<ICompositeItemEntity> [] {
		return generic.column.item.printColumns.length ? generic.column.item.printColumns : defaultColumns;
	}

	protected getRowSetting(generic: IComparePrintGenericProfile): IComparePrintRowBase {
		return generic.row.item;
	}

	protected async loadDependencies(): Promise<void> {
		await Promise.all([
			this.itemPrintDataSvc.loadCompareColumns()
		]);
	}

	protected override processCoverSheetTemplateData(templateData: IComparePrintTemplateData, context: IComparePrintContext, additionalInfo: IComparePrintAdditionalInfo): IComparePrintTemplateData {
		const itemTypesView: string[] = [];
		const itemTypes2View: string[] = [];
		let itemTypesCheckAll = true;
		let itemTypes2CheckAll = true;

		_.each(additionalInfo.itemTypes, (item) => {
			const isChecked = !!_.find(context.generic.item.checkedItemTypes, (x) => {
				return item.Id === x;
			});
			itemTypesView.push('<tr><td><input type="checkbox" disabled="disabled" ' + (isChecked ? 'checked="checked"' : '') + '></td><td>' + item.DisplayMember + '</td></tr>');
			itemTypesCheckAll = itemTypesCheckAll && isChecked;
		});

		_.each(additionalInfo.itemTypes2, (item) => {
			const isChecked = !!_.find(context.generic.item.checkedItemTypes2, (x) => {
				return item.Id === x;
			});
			itemTypes2View.push('<tr><td><input type="checkbox" disabled="disabled" ' + (isChecked ? 'checked="checked"' : '') + '></td><td>' + item.DisplayMember + '</td></tr>');
			itemTypes2CheckAll = itemTypes2CheckAll && isChecked;
		});

		templateData['&[_ItemTypeCheckedAll]'] = '<input type="checkbox" disabled="disabled" ' + (itemTypesCheckAll ? 'checked="checked"' : '') + ' />';
		templateData['&[_ItemType]'] = itemTypesView.join('');
		templateData['&[_ItemType2CheckedAll]'] = '<input type="checkbox" disabled="disabled" ' + (itemTypes2CheckAll ? 'checked="checked"' : '') + ' />';
		templateData['&[_ItemType2]'] = itemTypes2View.join('');
		templateData['&[_ItemClass]'] = 'show';

		return templateData;
	}
}