/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { IAdditionalSelectOptions, UiCommonLookupDataFactoryService } from '@libs/ui/common';
import { ProcurementPricecomparisonComparePrintPageBaseComponent } from '../compare-print-page-base/compare-print-page-base.component';
import { ICompositeBoqEntity } from '../../../../model/entities/boq/composite-boq-entity.interface';
import { IComparePrintBoq } from '../../../../model/entities/print/compare-print-boq.interface';
import { IComparePrintBaseTotal } from '../../../../model/entities/print/compare-print-base-total.interface';
import { IComparePrintBoqAbcAnalysisFilterBasis } from '../../../../model/entities/print/compare-print-boq-profile.interface';
import { Constants } from '../../../../model/constants/constants';
import { ICustomCompareColumnEntity } from '../../../../model/entities/custom-compare-column-entity.interface';

@Component({
	selector: 'procurement-pricecomparison-compare-print-abc-analysis-page',
	templateUrl: './compare-print-abc-analysis-page.component.html',
	styleUrls: ['./compare-print-abc-analysis-page.component.scss'],
})
export class ProcurementPricecomparisonComparePrintAbcAnalysisPageComponent extends ProcurementPricecomparisonComparePrintPageBaseComponent<ICompositeBoqEntity, IComparePrintBoq> {
	private readonly lookupFactory = inject(UiCommonLookupDataFactoryService);

	public allOptions = this.buildRadioOptions('1', 'procurement.pricecomparison.printing.printAll');
	public untilOptions = this.buildRadioOptions('2', 'procurement.pricecomparison.printing.printUntil');
	public atLeastOptions = this.buildRadioOptions('3', 'procurement.pricecomparison.printing.printAtLeast');
	public atLeastAmountOptions = this.buildRadioOptions('4', 'procurement.pricecomparison.printing.printAtLeast');

	public baseTotalLookupSvc = this.lookupFactory.fromItems<IComparePrintBaseTotal, IComparePrintBoqAbcAnalysisFilterBasis>([{
		id: -12,
		key: Constants.minValueIncludeTarget,
		isBidder: false,
		name: this.translateSvc.instant('procurement.pricecomparison.compareMinValueIncludeTarget').text,
	}, {
		id: -13,
		key: Constants.maxValueIncludeTarget,
		isBidder: false,
		name: this.translateSvc.instant('procurement.pricecomparison.compareMaxValueIncludeTarget').text,
	}, {
		id: -14,
		key: Constants.averageValueIncludeTarget,
		isBidder: false,
		name: this.translateSvc.instant('procurement.pricecomparison.compareAverageValueIncludeTarget').text,
	}].concat([
		...this.settings.quoteColumns.map(q => {
			return {
				id: q.QtnHeaderFk,
				key: this.formatterKey(q),
				isBidder: true,
				name: q.DescriptionInfo.Translated + (q.QuoteCode ? `(${q.QuoteCode})` : ''),
			};
		})
	]), {
		uuid: 'de084d18488045dab22b483a28d2a4ae',
		valueMember: 'id',
		displayMember: 'name'
	});

	private buildRadioOptions(id: string, key: string): IAdditionalSelectOptions<string> {
		return {
			itemsSource: {
				items: [{
					id: id,
					displayName: {key: key}
				}]
			}
		};
	}

	private formatterKey(item: ICustomCompareColumnEntity) {
		const quoteVersion = item.QtnHeaderFk > 0 ? item.QuoteVersion : item.QtnHeaderFk;
		if (!item.BusinessPartnerFk) {
			item.BusinessPartnerFk = item.QtnHeaderFk;
		}
		return Constants.prefix2 + Constants.columnFieldSeparator + item.QtnHeaderFk + Constants.columnFieldSeparator + item.BusinessPartnerFk + Constants.columnFieldSeparator + quoteVersion;
	}

	public onRadioCheckChanged(value: string) {
		this.settings.boq.analysis.criteria.selectedValue = value;
	}
}
