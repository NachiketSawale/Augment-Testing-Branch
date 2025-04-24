/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FieldType } from '@libs/ui/common';
import { IComparePrintCustomInfo } from '../../../model/entities/print/compare-print-generic-profile.interface';
import { ProcurementPricecomparisonCompareSettingRichEditorComponent } from '../compare-setting-rich-editor/compare-setting-rich-editor.component';

export enum CustomSectionNames {
	left = 'L',
	middle = 'M',
	right = 'R'
}

@Component({
	selector: 'procurement-pricecomparison-compare-setting-custom-section',
	templateUrl: './compare-setting-custom-section.component.html',
	styleUrls: ['./compare-setting-custom-section.component.scss'],
})
export class ProcurementPricecomparisonCompareSettingCustomSectionComponent {
	private _selectedText: string = '';
	public focusedEditor!: ProcurementPricecomparisonCompareSettingRichEditorComponent;

	public fieldType = FieldType;
	public sectionNames = CustomSectionNames;

	public get selectedText() {
		return this._selectedText;
	}

	@Input()
	public info!: IComparePrintCustomInfo;

	@Output()
	public sectionFocus: EventEmitter<CustomSectionNames> = new EventEmitter<CustomSectionNames>();

	@ViewChild('ctrlLeft', {read: ProcurementPricecomparisonCompareSettingRichEditorComponent})
	public ctrlLeft!: ProcurementPricecomparisonCompareSettingRichEditorComponent;

	@ViewChild('ctrlMiddle', {read: ProcurementPricecomparisonCompareSettingRichEditorComponent})
	public ctrlMiddle!: ProcurementPricecomparisonCompareSettingRichEditorComponent;

	@ViewChild('ctrlRight', {read: ProcurementPricecomparisonCompareSettingRichEditorComponent})
	public ctrlRight!: ProcurementPricecomparisonCompareSettingRichEditorComponent;

	public onSectionFocusing(name: CustomSectionNames) {
		switch (name) {
			case CustomSectionNames.left:
				this._selectedText = this.info.leftTemplate;
				this.focusedEditor = this.ctrlLeft;
				break;
			case CustomSectionNames.middle:
				this._selectedText = this.info.middleTemplate;
				this.focusedEditor = this.ctrlMiddle;
				break;
			case CustomSectionNames.right:
				this._selectedText = this.info.rightTemplate;
				this.focusedEditor = this.ctrlRight;
				break;
		}
		this.sectionFocus.next(name);
	}

	public onSectionChanged(name: CustomSectionNames, html: string) {
		switch (name) {
			case CustomSectionNames.left:
				this.info.leftTemplate = html;
				break;
			case CustomSectionNames.middle:
				this.info.middleTemplate = html;
				break;
			case CustomSectionNames.right:
				this.info.rightTemplate = html;
				break;
		}
		console.log(`name:${name}, html:${html}`);
	}

	public insertHTML(html: string) {
		this.focusedEditor?.insertHTML(html);
	}
}
