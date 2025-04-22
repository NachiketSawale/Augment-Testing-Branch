/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Injector, Type } from '@angular/core';
import { ICompositeBaseEntity } from '../../../../model/entities/composite-base-entity.interface';
import { IComparePrintBase } from '../../../../model/entities/print/compare-print-base.interface';
import { ProcurementPricecomparisonComparePrintPageBaseComponent } from '../compare-print-page-base/compare-print-page-base.component';
import { COMPARE_SETTING_DATA_TOKEN } from '../../../setting/compare-setting-dialog-body/compare-setting-dialog-body.component';
import { ProcurementPricecomparisonCompareSettingGridLayoutComponent } from '../../../setting/compare-setting-grid-layout/compare-setting-grid-layout.component';

@Component({
	selector: 'procurement-pricecomparison-compare-print-column-setting-page',
	templateUrl: './compare-print-column-setting-page.component.html',
	styleUrls: ['./compare-print-column-setting-page.component.scss'],
})
export class ProcurementPricecomparisonComparePrintColumnSettingPageComponent<
	T extends ICompositeBaseEntity<T>,
	PT extends IComparePrintBase<T>
> extends ProcurementPricecomparisonComparePrintPageBaseComponent<T, PT> {
	public component: Type<ProcurementPricecomparisonCompareSettingGridLayoutComponent<T, PT>> = ProcurementPricecomparisonCompareSettingGridLayoutComponent<T, PT>;
	public currInjector = Injector.create({
		parent: this.injector,
		providers: [{
			provide: COMPARE_SETTING_DATA_TOKEN,
			useValue: this.settings
		}]
	});

	public constructor() {
		super();
	}
}
