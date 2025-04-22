/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType } from '@libs/ui/common';
import _ from 'lodash';
import { ComparePrintServiceBase } from '../../../model/entities/print/compare-print-service-base.class';
import { ICompositeBoqEntity } from '../../../model/entities/boq/composite-boq-entity.interface';
import { ICompareBoqTreeResponse } from '../../../model/entities/boq/compare-boq-tree-response.interface';
import { IComparePrintGenericProfile, IComparePrintRowBase } from '../../../model/entities/print/compare-print-generic-profile.interface';
import { CompareGridColumn } from '../../../model/entities/compare-grid-column.interface';
import { ProcurementPricecomparisonCompareBoqDataService } from '../../data/boq/compare-boq-data.service';
import { ProcurementPricecomparisonComparePrintBoqSettingService } from '../setting/compare-print-boq-setting.service';
import { ProcurementPricecomparisonComparePrintBoqDataService } from '../data/compare-print-boq-data.service';
import { IComparePrintContext } from '../../../model/entities/print/compare-print-context.interface';
import { IComparePrintBoqProfile } from '../../../model/entities/print/compare-print-boq-profile.interface';
import { IComparePrintTemplateData } from '../../../model/entities/print/compare-print-template-data.interface';
import { IComparePrintAdditionalInfo } from '../../../model/entities/print/compare-print-additional-info.interface';
import { ICustomBoqItem } from '../../../model/entities/boq/custom-boq-item.interface';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPricecomparisonComparePrintBoqService extends ComparePrintServiceBase<
	ICompositeBoqEntity,
	ICompareBoqTreeResponse
> {
	protected constructor(
		private boqDataSvc: ProcurementPricecomparisonCompareBoqDataService,
		private boqPrintDataSvc: ProcurementPricecomparisonComparePrintBoqDataService,
		private boqPrintSettingSvc: ProcurementPricecomparisonComparePrintBoqSettingService
	) {
		super(boqDataSvc, boqPrintDataSvc, boqPrintSettingSvc);
	}

	protected getPrintName(): string {
		return 'item-price-comparison';
	}

	protected getPrintType(): string {
		return 'boq';
	}

	protected getPrintColumns(generic: IComparePrintGenericProfile, defaultColumns: CompareGridColumn<ICompositeBoqEntity>[]): CompareGridColumn<ICompositeBoqEntity>[] {
		return generic.column.boq.printColumns.length ? generic.column.boq.printColumns : defaultColumns;
	}

	protected getRowSetting(generic: IComparePrintGenericProfile): IComparePrintRowBase {
		return generic.row.boq;
	}

	protected override isOptionalWithoutITSummaryField(row: ICompositeBoqEntity): boolean {
		return this.utilSvc.isOptionalWithoutITSummaryField(row.LineTypeFk);
	}

	protected override isUrb(item: ICustomBoqItem): boolean {
		return item.IsUrb;
	}

	protected async loadDependencies(): Promise<void> {
		await Promise.all([
			this.boqPrintDataSvc.loadBoqRanges(),
			this.boqPrintDataSvc.loadCompareColumns()
		]);
	}

	protected override processColumns(columns: CompareGridColumn<ICompositeBoqEntity>[], context: IComparePrintContext): CompareGridColumn<ICompositeBoqEntity>[] {
		const rfq = context.rfq as IComparePrintBoqProfile;
		if (rfq.analysis && rfq.analysis.criteria.selectedValue.toString() !== '1') {
			columns.push({
				field: 'singlePercent',
				customFormatter: (row: number, cell: number, formattedValue: unknown, columnDef: CompareGridColumn<ICompositeBoqEntity>, dataContext: ICompositeBoqEntity) => {
					return this.utilSvc.formatValue(FieldType.Percent, row, cell, formattedValue, columnDef, dataContext) + ' %';
				},
				hidden: false,
				id: 'singlePercent',
				name: '%',
				width: 100,
				type: FieldType.Percent,
				sortable: false
			});
		}
		return columns;
	}

	protected override processCoverSheetTemplateData(templateData: IComparePrintTemplateData, context: IComparePrintContext, additionalInfo: IComparePrintAdditionalInfo): IComparePrintTemplateData {
		const itemTypesView: string[] = [];
		const itemTypes2View: string[] = [];
		let itemTypesCheckAll = true;
		let itemTypes2CheckAll = true;

		_.each(additionalInfo.itemTypes, (item) => {
			const isChecked = !!_.find(context.generic.boq.checkedBoqItemTypes, (x) => {
				return item.Id === x;
			});
			itemTypesView.push('<tr><td><input type="checkbox" disabled="disabled" ' + (isChecked ? 'checked="checked"' : '') + '></td><td>' + item.DisplayMember + '</td></tr>');
			itemTypesCheckAll = itemTypesCheckAll && isChecked;
		});

		_.each(additionalInfo.itemTypes2, (item) => {
			const isChecked = !!_.find(context.generic.boq.checkedBoqItemTypes2, (x) => {
				return item.Id === x;
			});
			itemTypes2View.push('<tr><td><input type="checkbox" disabled="disabled" ' + (isChecked ? 'checked="checked"' : '') + '></td><td>' + item.DisplayMember + '</td></tr>');
			itemTypes2CheckAll = itemTypes2CheckAll && isChecked;
		});

		templateData['&[_BoQItemTypeCheckedAll]'] = '<input type="checkbox" disabled="disabled" ' + (itemTypesCheckAll ? 'checked="checked"' : '') + ' />';
		templateData['&[_BoQItemType]'] = itemTypesView.join('');
		templateData['&[_BoQItemType2CheckedAll]'] = '<input type="checkbox" disabled="disabled" ' + (itemTypes2CheckAll ? 'checked="checked"' : '') + ' />';
		templateData['&[_BoQItemType2]'] = itemTypes2View.join('');

		// Ranges
		const boqRanges = this.boqPrintDataSvc.getBoqRanges();
		const boqRangeView: string[] = [];
		_.each(boqRanges, (range) => {
			boqRangeView.push('<tr><td>' + (range.ReferenceNo || '') + '</td><td>' + (range['HeaderOutlineSpecification'] || '') + '</td><td>' + (range['FromReferenceNo'] || '') + '</td><td>' + (range['ToReferenceNo'] || '') + '</td></tr>');
		});
		templateData['&[_BoQRange]'] = boqRangeView.join('');
		templateData['&[_BoQClass]'] = 'show';

		return templateData;
	}
}