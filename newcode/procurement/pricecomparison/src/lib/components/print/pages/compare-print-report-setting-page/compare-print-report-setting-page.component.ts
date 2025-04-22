/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { IAdditionalNumericOptions } from '@libs/ui/common';
import { PropertyType } from '@libs/platform/common';
import { ICompositeBaseEntity } from '../../../../model/entities/composite-base-entity.interface';
import { IComparePrintBase } from '../../../../model/entities/print/compare-print-base.interface';
import { ProcurementPricecomparisonComparePrintPageBaseComponent } from '../compare-print-page-base/compare-print-page-base.component';
import { ICommandBarContext, ICommandBarExecuteResult } from '../../../setting/compare-setting-command-bar/compare-setting-command-bar.component';
import { CustomSectionNames, ProcurementPricecomparisonCompareSettingCustomSectionComponent } from '../../../setting/compare-setting-custom-section/compare-setting-custom-section.component';

@Component({
	selector: 'procurement-pricecomparison-compare-print-report-setting-page',
	templateUrl: './compare-print-report-setting-page.component.html',
	styleUrls: ['./compare-print-report-setting-page.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ProcurementPricecomparisonComparePrintReportSettingPageComponent<
	T extends ICompositeBaseEntity<T>,
	PT extends IComparePrintBase<T>
> extends ProcurementPricecomparisonComparePrintPageBaseComponent<T, PT> {
	private focusedSection?: ProcurementPricecomparisonCompareSettingCustomSectionComponent;
	private focusedName ?: CustomSectionNames;
	public pageSizeOptions: IAdditionalNumericOptions = {
		minValue: 1
	};

	public specLengthOptions: IAdditionalNumericOptions = {
		minValue: 1
	};

	public commandBarContext: ICommandBarContext = {
		formatText: () => {
			return this.focusedSection?.selectedText ?? '';
		}
	};

	public constructor() {
		super();

		this.settings.report.bidderPageSize = Math.max(this.settings.report.bidderPageSize, this.pageSizeOptions.minValue as number);
		this.settings.report.shortenOutlineSpecValue = Math.max(this.settings.report.shortenOutlineSpecValue, this.specLengthOptions.minValue as number);
	}

	@ViewChild('ctrlHeader', {read: ProcurementPricecomparisonCompareSettingCustomSectionComponent})
	public ctrlHeader!: ProcurementPricecomparisonCompareSettingCustomSectionComponent;

	@ViewChild('ctrlFooter', {read: ProcurementPricecomparisonCompareSettingCustomSectionComponent})
	public ctrlFooter!: ProcurementPricecomparisonCompareSettingCustomSectionComponent;

	public onCoverSheetChanged(value: PropertyType) {
		this.settings.report.coverSheetCheck = value as boolean;
	}

	public onNameAnonymousChanged(value: PropertyType) {
		this.settings.report.bidderNameCheck = value as boolean;
	}

	public onMaxBidderChanged(value: PropertyType) {
		this.settings.report.bidderPageSizeCheck = value as boolean;
	}

	public onPageSizeChanged(value: PropertyType) {
		this.settings.report.bidderPageSize = value as number;
	}

	public onSpecLengthCheckChanged(value: PropertyType) {
		this.settings.report.shortenOutlineSpecCheck = value as boolean;
	}

	public onSpecLengthChanged(value: PropertyType) {
		this.settings.report.shortenOutlineSpecValue = value as number;
	}

	public onCommandBarExecuted(value: ICommandBarExecuteResult) {
		if (this.focusedSection && this.focusedName) {
			switch (value.cmdType) {
				default:
					this.focusedSection.insertHTML(value.result as string);
					break;
			}
		}
	}

	public onHeaderSectionFocus(name: CustomSectionNames) {
		this.focusedName = name;
		this.focusedSection = this.ctrlHeader;
	}

	public onFooterSectionFocus(name: CustomSectionNames) {
		this.focusedName = name;
		this.focusedSection = this.ctrlFooter;
	}
}
