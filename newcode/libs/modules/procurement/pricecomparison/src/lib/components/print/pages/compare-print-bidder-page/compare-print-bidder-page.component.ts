/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Injector, Type } from '@angular/core';
import { FieldType } from '@libs/ui/common';
import { ICompositeBaseEntity } from '../../../../model/entities/composite-base-entity.interface';
import { IComparePrintBase } from '../../../../model/entities/print/compare-print-base.interface';
import { ProcurementPricecomparisonComparePrintPageBaseComponent } from '../compare-print-page-base/compare-print-page-base.component';
import { ProcurementPricecomparisonCompareSettingQuoteColumnComponent } from '../../../setting/compare-setting-quote-column/compare-setting-quote-column.component';
import { COMPARE_SETTING_DATA_TOKEN, COMPARE_SETTING_GRID_STATE_OPTIONS_TOKEN } from '../../../setting/compare-setting-dialog-body/compare-setting-dialog-body.component';
import { ICompareGridStateOptions } from '../../../../model/entities/compare-grid-state-options.interface';
import { ICustomCompareColumnEntity } from '../../../../model/entities/custom-compare-column-entity.interface';


@Component({
	selector: 'procurement-pricecomparison-compare-print-bidder-page',
	templateUrl: './compare-print-bidder-page.component.html',
	styleUrls: ['./compare-print-bidder-page.component.scss'],
})
export class ProcurementPricecomparisonComparePrintBidderPageComponent<
	T extends ICompositeBaseEntity<T>,
	PT extends IComparePrintBase<T>
> extends ProcurementPricecomparisonComparePrintPageBaseComponent<T, PT> {
	private gridOptions: ICompareGridStateOptions<ICustomCompareColumnEntity> = {
		handleConfig: (config) => {
			if (!config.columns) {
				return;
			}

			config.columns.push({
				id: 'width',
				model: 'Width',
				label: {
					text: 'Width',
					key: 'cloud.desktop.gridWidthHeader'
				},
				type: FieldType.Percent,
				sortable: false
			});
			config.columns.push({
				id: 'groupSequence',
				model: 'GroupSequence',
				label: {
					text: 'Group Sequence',
					key: 'procurement.pricecomparison.printing.groupSequence'
				},
				type: FieldType.Integer,
				sortable: false
			});

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

	public component: Type<ProcurementPricecomparisonCompareSettingQuoteColumnComponent<T, PT>> = ProcurementPricecomparisonCompareSettingQuoteColumnComponent<T, PT>;
	public currInjector = Injector.create({
		parent: this.injector,
		providers: [{
			provide: COMPARE_SETTING_DATA_TOKEN,
			useValue: this.settings
		}, {
			provide: COMPARE_SETTING_GRID_STATE_OPTIONS_TOKEN,
			useValue: this.gridOptions
		}]
	});

	public constructor() {
		super();
	}
}
