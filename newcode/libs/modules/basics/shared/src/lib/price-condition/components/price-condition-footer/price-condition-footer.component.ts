/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject } from '@angular/core';
import { sumBy } from 'lodash';
import { BasicsSharedPriceConditionHeaderGridFooterInfoToken } from '../../model/interfaces/pricecondition-header-footer-info.interface';

/**
 * show  total at bottom of price condition container
 */
@Component({
	templateUrl: './price-condition-footer.component.html',
	styleUrl: './price-condition-footer.component.scss',
})
export class BasicsSharedPriceConditionFooterComponent {
	public dataService = inject(BasicsSharedPriceConditionHeaderGridFooterInfoToken).dataService;

	public total() {
		return this.dataService ? sumBy(this.dataService.getList(), (item) => (item.IsPriceComponent ? item.Total : 0)) : 0;
	}

	public totalOc() {
		return this.dataService ? sumBy(this.dataService.getList(), (item) => (item.IsPriceComponent ? item.TotalOc : 0)) : 0;
	}
}
