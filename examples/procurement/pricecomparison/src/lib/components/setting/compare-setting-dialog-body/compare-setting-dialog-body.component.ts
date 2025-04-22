/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, InjectionToken, StaticProvider, inject } from '@angular/core';
import { getCustomDialogDataToken, IAccordionItem, StandardDialogButtonId } from '@libs/ui/common';
import { ICompositeBaseEntity } from '../../../model/entities/composite-base-entity.interface';
import { ICompareSettingBase } from '../../../model/entities/compare-setting-base.interface';
import { ICompareSettingDialogContext, ICompareSettingEditorDialog } from '../../../model/entities/compare-setting-dialog-options.inteface';

export const COMPARE_SETTING_DLG_CONTEXT_TOKEN = new InjectionToken('compare-setting-dlg-context-token');
export const COMPARE_SETTING_DATA_TOKEN = new InjectionToken('compare-setting-data-token');
export const COMPARE_SETTINGS_BOQ_RANGE_DATA_TOEKN = new InjectionToken('compare-setting-boq-range-data-token');
export const COMPARE_SETTING_GRID_UUID_LAYOUT_VISIBLE_TOKEN = new InjectionToken('compare-setting-grid-uuid-layout-visible-token');
export const COMPARE_SETTING_GRID_UUID_LAYOUT_AVAILABLE_TOKEN = new InjectionToken('compare-setting-grid-uuid-layout-available-token');
export const COMPARE_SETTING_GRID_UUID_QUOTE_COLUMN_TOKEN = new InjectionToken('compare-setting-grid-uuid-quote-column-token');
export const COMPARE_SETTING_GRID_UUID_QUOTE_FIELD_TOKEN = new InjectionToken('compare-setting-grid-uuid-quote-field-token');
export const COMPARE_SETTING_GRID_UUID_BILLING_SCHEMA_FIELD_TOKEN = new InjectionToken('compare-setting-grid-uuid-billing-schema-field-token');
export const COMPARE_SETTING_GRID_UUID_COMPARE_FIELD_TOKEN = new InjectionToken('compare-setting-grid-uuid-compare-field-token');
export const COMPARE_SETTING_GRID_UUID_BOQ_RANGE_TOKEN = new InjectionToken('compare-setting-grid-uuid-boq-range-token');
export const COMPARE_SETTING_GRID_STATE_OPTIONS_TOKEN = new InjectionToken('compare-setting-grid-state-options-token');

@Component({
	selector: 'procurement-pricecomparison-compare-setting-dialog-body',
	templateUrl: './compare-setting-dialog-body.component.html',
	styleUrls: ['./compare-setting-dialog-body.component.scss'],
})
export class ProcurementPricecomparisonCompareSettingDialogBodyComponent<
	T extends ICompositeBaseEntity<T>,
	ST extends ICompareSettingBase<T>
> {
	private readonly dlgWrapper = inject(getCustomDialogDataToken<ST, ProcurementPricecomparisonCompareSettingDialogBodyComponent<T, ST>>());
	public settings?: ST;
	public dialogInfo: ICompareSettingEditorDialog<T, ST>;
	public accordionItems: IAccordionItem[] = [];
	public loading: boolean = true;
	public readonly dialogContext = inject<ICompareSettingDialogContext<T, ST>>(COMPARE_SETTING_DLG_CONTEXT_TOKEN);

	public constructor() {
		this.dialogInfo = (function createDialogInfoFn(owner: ProcurementPricecomparisonCompareSettingDialogBodyComponent<T, ST>): ICompareSettingEditorDialog<T, ST> {
			return {
				get value(): ST {
					return owner.dlgWrapper.value as ST;
				},
				set value(v: ST) {
					owner.dlgWrapper.value = v;
				},
				get loading(): boolean {
					return owner.loading;
				},
				set loading(v: boolean) {
					owner.loading = v;
				},
				close(closingButtonId?: StandardDialogButtonId | string) {
					owner.dlgWrapper.close(closingButtonId);
				}
			};
		})(this);

		this.dialogContext.settings().then(settings => {
			this.dialogInfo.value = this.settings = settings;
			this.accordionItems = this.buildAccordionGroups();
			this.loading = false;
		});
	}

	private buildAccordionGroups(): IAccordionItem[] {
		return this.dialogContext.sections.map((s, i) => {
			const providers: StaticProvider[] = [{
				provide: COMPARE_SETTING_DATA_TOKEN,
				useValue: this.dialogInfo.value
			}];
			if (s.providers) {
				providers.push(...s.providers);
			}
			return {
				id: i,
				title: s.title,
				expanded: s.expanded,
				children: [{
					id: i + '0',
					component: s.component,
					providers: providers
				}]
			};
		});
	}
}
