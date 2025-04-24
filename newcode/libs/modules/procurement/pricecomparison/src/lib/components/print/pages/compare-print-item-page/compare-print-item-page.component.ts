/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Injector, Type } from '@angular/core';
import { ProcurementPricecomparisonComparePrintPageBaseComponent } from '../compare-print-page-base/compare-print-page-base.component';
import { COMPARE_SETTING_DATA_TOKEN } from '../../../setting/compare-setting-dialog-body/compare-setting-dialog-body.component';
import { IComparePrintItem } from '../../../../model/entities/print/compare-print-item.interface';
import { ICompositeItemEntity } from '../../../../model/entities/item/composite-item-entity.interface';
import { ProcurementPricecomparisonCompareSettingItemTypeComponent } from '../../../setting/compare-setting-item-type/compare-setting-item-type.component';

@Component({
	selector: 'procurement-pricecomparison-compare-print-item-page',
	templateUrl: './compare-print-item-page.component.html',
	styleUrls: ['./compare-print-item-page.component.scss'],
})
export class ProcurementPricecomparisonComparePrintItemPageComponent extends ProcurementPricecomparisonComparePrintPageBaseComponent<
	ICompositeItemEntity,
	IComparePrintItem
> {
	public itemTypeComponent: Type<ProcurementPricecomparisonCompareSettingItemTypeComponent> = ProcurementPricecomparisonCompareSettingItemTypeComponent;
	public itemTypeInjector = Injector.create({
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