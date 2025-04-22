/*
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';
import { PropertyType } from '@libs/platform/common';
import { IAdditionalSelectOptions, IControlContext } from '@libs/ui/common';
import { ICompositeBaseEntity } from '../../../../model/entities/composite-base-entity.interface';
import { IComparePrintBase } from '../../../../model/entities/print/compare-print-base.interface';
import { ProcurementPricecomparisonComparePrintPageBaseComponent } from '../compare-print-page-base/compare-print-page-base.component';
import { ComparePrintConstants } from '../../../../model/constants/print/compare-print-constats';
import { DomainControlContext } from '../../../../model/classes/domain-control-context.class';

@Component({
	selector: 'procurement-pricecomparison-compare-print-layout-page',
	templateUrl: './compare-print-layout-page.component.html',
	styleUrls: ['./compare-print-layout-page.component.scss'],
})
export class ProcurementPricecomparisonComparePrintLayoutPageComponent<
	T extends ICompositeBaseEntity<T>,
	PT extends IComparePrintBase<T>
> extends ProcurementPricecomparisonComparePrintPageBaseComponent<T, PT> {
	public orientationContext: IControlContext = ((owner: ProcurementPricecomparisonComparePrintLayoutPageComponent<T, PT>) => {
		return new DomainControlContext('print_layout_orientation', false, {
			get value(): string | undefined {
				return owner.settings.pageLayout.orientation.toString();
			},
			set value(v: string) {
				owner.settings.pageLayout.orientation = v;
			}
		});
	})(this);
	public orientationOptions: IAdditionalSelectOptions<string> = {
		itemsSource: {
			items: [{
				id: ComparePrintConstants.orientation.portrait,
				displayName: {key: 'procurement.pricecomparison.printing.pagePortrait'}
			}, {
				id: ComparePrintConstants.orientation.landscape,
				displayName: {key: 'procurement.pricecomparison.printing.pageLandscape'}
			}]
		}
	};

	public paperSizeOptions: IAdditionalSelectOptions<string> = {
		itemsSource: {
			items: [{
				id: ComparePrintConstants.paperSize.A4.toString(),
				displayName: {key: 'procurement.pricecomparison.printing.formatA4'}
			}, {
				id: ComparePrintConstants.paperSize.A3.toString(),
				displayName: {key: 'procurement.pricecomparison.printing.formatA3'}
			}, {
				id: ComparePrintConstants.paperSize.Letter.toString(),
				displayName: {key: 'procurement.pricecomparison.printing.formatLetter'}
			}]
		}
	};

	public get paperSize() {
		return this.settings.pageLayout.paperSize.toString();
	}

	public constructor() {
		super();
	}

	public onOrientationChanged(value: PropertyType) {
		this.settings.pageLayout.orientation = value as string;
	}

	public onPaperSizeOptionsChanged(value: PropertyType) {
		// TODO-DRIZZLE: It seems that this event can't be triggered because of the select control implementation.
		this.settings.pageLayout.paperSize = parseInt(value.toString());
	}
}
