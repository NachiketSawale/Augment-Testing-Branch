/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Injector, Type } from '@angular/core';
import { ProcurementPricecomparisonComparePrintPageBaseComponent } from '../compare-print-page-base/compare-print-page-base.component';
import { ProcurementPricecomparisonCompareSettingSummaryFieldComponent } from '../../../setting/compare-setting-summary-field/compare-setting-summary-field.component';
import { ICompositeBoqEntity } from '../../../../model/entities/boq/composite-boq-entity.interface';
import { IComparePrintBoq } from '../../../../model/entities/print/compare-print-boq.interface';
import { COMPARE_SETTING_DATA_TOKEN, COMPARE_SETTINGS_BOQ_RANGE_DATA_TOEKN } from '../../../setting/compare-setting-dialog-body/compare-setting-dialog-body.component';
import { ProcurementPricecomparisonCompareSettingBoqRangeComponent } from '../../../setting/compare-setting-boq-range/compare-setting-boq-range.component';

@Component({
	selector: 'procurement-pricecomparison-compare-print-boq-page',
	templateUrl: './compare-print-boq-page.component.html',
	styleUrls: ['./compare-print-boq-page.component.scss'],
})
export class ProcurementPricecomparisonComparePrintBoqPageComponent extends ProcurementPricecomparisonComparePrintPageBaseComponent<ICompositeBoqEntity, IComparePrintBoq> {
	public summaryComponent: Type<ProcurementPricecomparisonCompareSettingSummaryFieldComponent> = ProcurementPricecomparisonCompareSettingSummaryFieldComponent;
	public summaryInjector = Injector.create({
		parent: this.injector,
		providers: [{
			provide: COMPARE_SETTING_DATA_TOKEN,
			useValue: this.settings
		}]
	});

	public boqRangeComponent: Type<ProcurementPricecomparisonCompareSettingBoqRangeComponent> = ProcurementPricecomparisonCompareSettingBoqRangeComponent;
	public boqRangeInjector = Injector.create({
		parent: this.injector,
		providers: [{
			provide: COMPARE_SETTING_DATA_TOKEN,
			useValue: this.settings
		}, {
			provide: COMPARE_SETTINGS_BOQ_RANGE_DATA_TOEKN,
			useValue: this.settings.ranges
		}]
	});

	public constructor() {
		super();
	}
}
