/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { FieldType, getCustomDialogDataToken, IAdditionalSelectOptions, StandardDialogButtonId } from '@libs/ui/common';
import { PropertyType } from '@libs/platform/common';
import { ICompareExportUserDecisionEditorDialog } from '../../../model/entities/export/compare-export-user-decision-editor-dialog.interface';

@Component({
	selector: 'procurement-pricecomparison-compare-export-user-decision',
	templateUrl: './compare-export-user-decision.component.html',
	styleUrls: ['./compare-export-user-decision.component.scss'],
})
export class ProcurementPricecomparisonCompareExportUserDecisionComponent {
	public fieldType = FieldType;
	public readonly dlgWrapper = inject(getCustomDialogDataToken<boolean, ProcurementPricecomparisonCompareExportUserDecisionComponent>());
	public options: IAdditionalSelectOptions<string> = {
		itemsSource: {
			items: [{
				id: 'false',
				displayName: {key: 'procurement.pricecomparison.onlySaveModified'}
			}, {
				id: 'true',
				displayName: {key: 'procurement.pricecomparison.saveAllQuote'}
			}]
		}
	};

	public loading: boolean = false;
	public message: string = '';
	public dialogInfo: ICompareExportUserDecisionEditorDialog;

	public constructor() {
		this.dialogInfo = (function createDialogInfoFn(owner: ProcurementPricecomparisonCompareExportUserDecisionComponent): ICompareExportUserDecisionEditorDialog {
			return {
				get value(): boolean {
					return owner.dlgWrapper.value as boolean;
				},
				set value(v: boolean) {
					owner.dlgWrapper.value = v;
				},
				get loading(): boolean {
					return owner.loading;
				},
				set loading(v: boolean) {
					owner.loading = v;
				},
				get message(): string {
					return owner.message;
				},
				set message(v: string) {
					owner.message = v;
				},
				close(closingButtonId?: StandardDialogButtonId | string) {
					owner.dlgWrapper.close(closingButtonId);
				}
			};
		})(this);
	}

	public onOptionChanged(value: PropertyType) {
		this.dlgWrapper.value = value.toString() === 'true';
	}
}
