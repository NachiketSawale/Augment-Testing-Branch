/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { ProcurementPricecomparisonCompareBoqDataService } from '../../data/boq/compare-boq-data.service';
import { ICompareRowEntity } from '../../../model/entities/compare-row-entity.interface';
import { CompareFields } from '../../../model/constants/compare-fields';
import { ICompareBoqTreeResponse } from '../../../model/entities/boq/compare-boq-tree-response.interface';
import { ProcurementPricecomparisonDescriptionTranslateService } from '../../description-translate.service';
import { CompareBoqColumnBuilder } from '../../../model/entities/boq/compare-boq-column-builder.class';
import { CompareExportBoqColumnBuilder } from '../../../model/entities/boq/export/compare-export-boq-column-builder.class';
import { ICompareExportRowFormulaRule } from '../../../model/entities/export/compare-export-formula-rule.interface';
import { ICompositeBoqEntity } from '../../../model/entities/boq/composite-boq-entity.interface';
import { ICompareExportConfig } from '../../../model/entities/export/compare-export-config.interface';
import { ProcurementPricecomparisonCompareExportBoqFormulaService } from './compare-export-boq-formula.service';
import { ICompareExportBoqUserData } from '../../../model/entities/export/compare-export-user-data.interface';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPricecomparisonCompareExportBoqDataService extends ProcurementPricecomparisonCompareBoqDataService {
	private readonly translateSvc = inject(ProcurementPricecomparisonDescriptionTranslateService);
	private readonly formulaSvc = inject(ProcurementPricecomparisonCompareExportBoqFormulaService);

	public readonly config: ICompareExportConfig = {
		required: {
			quoteFields: [CompareFields.exchangeRate],
			compareFields: [
				CompareFields.price,
				CompareFields.priceOc,
				CompareFields.priceGross,
				CompareFields.priceGrossOc,
				CompareFields.discountPercent,
				CompareFields.discountPercentIT,
				CompareFields.discount,
				CompareFields.discountedPrice,
				CompareFields.discountedUnitPrice,
				CompareFields.finalPrice,
				CompareFields.finalPriceOc,
				CompareFields.finalGross,
				CompareFields.finalGrossOc,
				CompareFields.itemTotal,
				CompareFields.itemTotalOc,
				CompareFields.percentage,
				CompareFields.absoluteDifference,
				CompareFields.cost,
				CompareFields.lumpsumPrice,
				CompareFields.quantity,
				CompareFields.factor,
				CompareFields.extraIncrement,
				CompareFields.extraIncrementOc,
				CompareFields.quantityAdj
			],
			additionalFields: [
				this.utilService.buildAdditionalCompareField(CompareFields.factor, 'Factor', 47),
				this.utilService.buildAdditionalCompareField(CompareFields.extraIncrement, 'Extra Increment', 48),
				this.utilService.buildAdditionalCompareField(CompareFields.extraIncrementOc, 'Extra Increment OC', 49)
			],
		},
		hide: {
			quoteFields: [],
			compareFields: [],
			columns: []
		},
		formula: {
			excludeRows: [
				CompareFields.rank,
				CompareFields.commentContractor,
				CompareFields.commentClient,
				CompareFields.prcItemEvaluationFk,
				CompareFields.bidderComments,
				CompareFields.quoteUserDefined1,
				CompareFields.quoteUserDefined2,
				CompareFields.quoteUserDefined3,
				CompareFields.quoteUserDefined4,
				CompareFields.quoteUserDefined5,
				CompareFields.alternativeBid,
				CompareFields.isLumpsum,
				CompareFields.boqTotalRank,
				CompareFields.externalCode,
				CompareFields.notSubmitted,
				CompareFields.included,
				CompareFields.uomFk,
				CompareFields.factor,
				CompareFields.exQtnIsEvaluated,
				CompareFields.prjChangeFk,
				CompareFields.prjChangeStatusFk
			],
			excludeColumns: [
				'tree',
				'CompareDescription',
				'Reference',
				'BasItemTypeFk',
				'BasItemType2Fk',
				'Quantity',
				'QuantityAdjustment',
				'LineName',
				'BoqLineType',
				'IsFreeQuantity',
				'IsNoLeadQuantity',
				'Aan',
				'Agn',
				'IsContracted',
				'IsDisabled',
				'ExternalCode',
				'ItemInfo',
				'IsLeadDescription',
				'IsNotApplicable',
				'Brief',
				'UomFk',
				'UserDefined1',
				'UserDefined2',
				'UserDefined3',
				'UserDefined4',
				'UserDefined5'
			]
		}
	};

	public readonly formulaRules: ICompareExportRowFormulaRule<ICompositeBoqEntity, ICompareExportBoqUserData>[] = this.formulaSvc.createFormulaRules(
		this.compareCache.taxCodes,
		this.compareCache.taxCodeMatrixes
	);

	protected override getColumnBuilder(): CompareBoqColumnBuilder {
		return new CompareExportBoqColumnBuilder(this);
	}

	public override getCompareQuoteRows(): ICompareRowEntity[] {
		const rows = super.getCompareQuoteRows();
		return this.utilService.mergeWithRequiredFields(rows, this.config.required.quoteFields, null, this.config.hide.quoteFields);
	}

	public override getCompareRows(): ICompareRowEntity[] {
		const rows = super.getCompareRows();
		return this.utilService.mergeWithRequiredFields(rows, this.config.required.compareFields, this.config.required.additionalFields, this.config.hide.compareFields);
	}

	protected override getCompareRowsFromResponse(response: ICompareBoqTreeResponse): ICompareRowEntity[] {
		const rows = super.getCompareRowsFromResponse(response);

		rows.forEach(row => {
			const target = this.config.required.additionalFields.find(e => e.Id === row.Id);
			if (target) {
				row.FieldName = this.translateSvc.getBoqDisplayText(row.Field, null, row.DefaultDescription);
				row.DisplayName = this.translateSvc.getBoqDisplayText(row.Field, row.UserLabelName, row.DefaultDescription);
			}
		});

		return rows;
	}
}