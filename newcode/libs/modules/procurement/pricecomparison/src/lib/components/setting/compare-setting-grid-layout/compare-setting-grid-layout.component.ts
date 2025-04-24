/*
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';
import { ProcurementPricecomparisonCompareSettingBaseComponent } from '../compare-setting-base/compare-setting-base.component';
import { ICompositeBaseEntity } from '../../../model/entities/composite-base-entity.interface';
import { ICompareSettingBase } from '../../../model/entities/compare-setting-base.interface';

@Component({
	selector: 'procurement-pricecomparison-compare-setting-grid-layout',
	templateUrl: './compare-setting-grid-layout.component.html',
	styleUrls: ['./compare-setting-grid-layout.component.scss'],
})
export class ProcurementPricecomparisonCompareSettingGridLayoutComponent<
	T extends ICompositeBaseEntity<T>,
	ST extends ICompareSettingBase<T>
> extends ProcurementPricecomparisonCompareSettingBaseComponent<T, ST> {
	public constructor() {
		super();
	}
}
