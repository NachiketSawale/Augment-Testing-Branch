/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { ProcurementPricecomparisonCompareItemDataService } from '../../data/item/compare-item-data.service';
import { ICompareRowEntity } from '../../../model/entities/compare-row-entity.interface';
import { CompareFields } from '../../../model/constants/compare-fields';
import { ICompareItemTreeResponse } from '../../../model/entities/item/compare-item-tree-response.interface';
import { ProcurementPricecomparisonDescriptionTranslateService } from '../../description-translate.service';
import { CompareExportItemColumnBuilder } from '../../../model/entities/item/export/compare-export-item-column-builder.class';
import { CompareItemColumnBuilder } from '../../../model/entities/item/compare-item-column-builder.class';
import { ICompareExportRowFormulaRule } from '../../../model/entities/export/compare-export-formula-rule.interface';
import { ICompositeItemEntity } from '../../../model/entities/item/composite-item-entity.interface';
import { ICompareExportConfig } from '../../../model/entities/export/compare-export-config.interface';
import { ICompareExportItemUserData } from '../../../model/entities/export/compare-export-user-data.interface';
import { ProcurementPricecomparisonCompareExportItemFormulaService } from './compare-export-item-formula.service';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPricecomparisonCompareExportItemDataService extends ProcurementPricecomparisonCompareItemDataService {
	private readonly translateSvc = inject(ProcurementPricecomparisonDescriptionTranslateService);
	private readonly formulaSvc = inject(ProcurementPricecomparisonCompareExportItemFormulaService);

	public readonly config: ICompareExportConfig = {
		required: {
			quoteFields: [CompareFields.exchangeRate],
			compareFields: [
				CompareFields.price,
				CompareFields.priceOc,
				CompareFields.priceExtra,
				CompareFields.priceExtraOc,
				CompareFields.priceUnit,
				CompareFields.priceGross,
				CompareFields.priceOCGross,
				CompareFields.totalPrice,
				CompareFields.total,
				CompareFields.totalOC,
				CompareFields.totalNoDiscount,
				CompareFields.totalOcNoDiscount,
				CompareFields.totalGross,
				CompareFields.totalOCGross,
				CompareFields.totalPriceGross,
				CompareFields.totalPriceOCGross,
				CompareFields.discount,
				CompareFields.discountAbsolute,
				CompareFields.quantity,
				CompareFields.totalPriceOc,
				CompareFields.priceUnit,
				CompareFields.factorPriceUnit,
				CompareFields.discountSplit,
				CompareFields.discountSplitOc,
				CompareFields.percentage,
				CompareFields.absoluteDifference,
				CompareFields.charge,
				CompareFields.chargeOc
			],
			additionalFields: [
				this.utilService.buildAdditionalCompareField(CompareFields.factorPriceUnit, 'Factor Price Unit', 45)
			],
		},
		hide: {
			quoteFields: [],
			compareFields: [],
			columns: []
		},
		formula: {
			excludeRows: [],
			excludeColumns: []
		}
	};

	public readonly formulaRules: ICompareExportRowFormulaRule<ICompositeItemEntity, ICompareExportItemUserData>[] = this.formulaSvc.createFormulaRules(
		this.compareCache.taxCodes,
		this.compareCache.taxCodeMatrixes
	);

	protected override getColumnBuilder(): CompareItemColumnBuilder {
		return new CompareExportItemColumnBuilder(this);
	}

	public override getCompareQuoteRows(): ICompareRowEntity[] {
		const rows = super.getCompareQuoteRows();
		return this.utilService.mergeWithRequiredFields(rows, this.config.required.quoteFields, null, this.config.hide.quoteFields);
	}

	public override getCompareRows(): ICompareRowEntity[] {
		const rows = super.getCompareRows();
		return this.utilService.mergeWithRequiredFields(rows, this.config.required.compareFields, this.config.required.additionalFields, this.config.hide.compareFields);
	}

	protected override getCompareRowsFromResponse(response: ICompareItemTreeResponse): ICompareRowEntity[] {
		const rows = super.getCompareRowsFromResponse(response);
		rows.forEach(row => {
			const target = this.config.required.additionalFields.find(e => e.Id === row.Id);
			if (target) {
				row.FieldName = this.translateSvc.getItemDisplayText(row.Field, null, row.DefaultDescription);
				row.DisplayName = this.translateSvc.getItemDisplayText(row.Field, row.UserLabelName, row.DefaultDescription);
			}
		});
		return rows;
	}
}