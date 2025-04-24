/*
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';
import { IAccordionItem } from '@libs/ui/common';
import { COMPARE_SETTING_DATA_TOKEN, COMPARE_SETTING_GRID_STATE_OPTIONS_TOKEN } from '../../../setting/compare-setting-dialog-body/compare-setting-dialog-body.component';
import { ICompositeBaseEntity } from '../../../../model/entities/composite-base-entity.interface';
import { IComparePrintBase } from '../../../../model/entities/print/compare-print-base.interface';
import { ProcurementPricecomparisonComparePrintPageBaseComponent } from '../compare-print-page-base/compare-print-page-base.component';
import { ProcurementPricecomparisonCompareSettingQuoteFieldComponent } from '../../../setting/compare-setting-quote-field/compare-setting-quote-field.component';
import { ProcurementPricecomparisonCompareSettingBillingSchemaFieldComponent } from '../../../setting/compare-setting-billing-schema-field/compare-setting-billing-schema-field.component';
import { ProcurementPricecomparisonCompareSettingCompareFieldComponent } from '../../../setting/compare-setting-compare-field/compare-setting-compare-field.component';
import { CompareSettingGroups } from '../../../../model/constants/compare-setting-groups';
import { ICompareGridStateOptions } from '../../../../model/entities/compare-grid-state-options.interface';
import { ICompareRowEntity } from '../../../../model/entities/compare-row-entity.interface';

@Component({
	selector: 'procurement-pricecomparison-compare-print-row-setting-page',
	templateUrl: './compare-print-row-setting-page.component.html',
	styleUrls: ['./compare-print-row-setting-page.component.scss'],
})
export class ProcurementPricecomparisonComparePrintRowSettingPageComponent<
	T extends ICompositeBaseEntity<T>,
	PT extends IComparePrintBase<T>
> extends ProcurementPricecomparisonComparePrintPageBaseComponent<T, PT> {
	private gridOptions: ICompareGridStateOptions<ICompareRowEntity> = {
		handleConfig: (config) => {
			if (!config.columns) {
				return;
			}

			config.columns.forEach(col => {
				if (col.id === 'Visible') {
					col.id = 'Print';
					col.label = {
						text: 'Print',
						key: 'procurement.pricecomparison.printing.print'
					};
				}
			});
		}
	};
	public accordionItems: IAccordionItem[] = [];

	public constructor() {
		super();
		this.accordionItems = this.buildAccordionGroups();
	}

	private buildAccordionGroups(): IAccordionItem[] {
		return [{
			id: 1,
			title: CompareSettingGroups.quoteField.title,
			expanded: true,
			children: [{
				id: CompareSettingGroups.quoteField.id,
				component: ProcurementPricecomparisonCompareSettingQuoteFieldComponent,
				providers: [{
					provide: COMPARE_SETTING_DATA_TOKEN,
					useValue: this.settings
				}, {
					provide: COMPARE_SETTING_GRID_STATE_OPTIONS_TOKEN,
					useValue: this.gridOptions
				}]
			}]
		}, {
			id: 2,
			title: CompareSettingGroups.billingSchemaField.title,
			expanded: true,
			children: [{
				id: CompareSettingGroups.billingSchemaField.id,
				component: ProcurementPricecomparisonCompareSettingBillingSchemaFieldComponent,
				providers: [{
					provide: COMPARE_SETTING_DATA_TOKEN,
					useValue: this.settings
				}, {
					provide: COMPARE_SETTING_GRID_STATE_OPTIONS_TOKEN,
					useValue: this.gridOptions
				}]
			}]
		}, {
			id: 3,
			title: CompareSettingGroups.compareField.title,
			expanded: true,
			children: [{
				id: CompareSettingGroups.compareField.id,
				component: ProcurementPricecomparisonCompareSettingCompareFieldComponent,
				providers: [{
					provide: COMPARE_SETTING_DATA_TOKEN,
					useValue: this.settings
				}, {
					provide: COMPARE_SETTING_GRID_STATE_OPTIONS_TOKEN,
					useValue: this.gridOptions
				}]
			}]
		}];
	}
}
