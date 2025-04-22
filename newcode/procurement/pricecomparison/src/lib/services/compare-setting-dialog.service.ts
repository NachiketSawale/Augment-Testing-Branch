/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, StaticProvider } from '@angular/core';
import { IDialogButtonEventInfo, StandardDialogButtonId, UiCommonDialogService } from '@libs/ui/common';
import { ICompareSettingBase } from '../model/entities/compare-setting-base.interface';
import { ICompositeBaseEntity } from '../model/entities/composite-base-entity.interface';
import { COMPARE_SETTING_DLG_CONTEXT_TOKEN, ProcurementPricecomparisonCompareSettingDialogBodyComponent } from '../components/setting/compare-setting-dialog-body/compare-setting-dialog-body.component';
import { ICompareSettingDialogContext, ICompareSettingDialogOptions, ICompareSettingEditorDialog, ICompareSettingSection } from '../model/entities/compare-setting-dialog-options.inteface';
import { CompareSettingGroups } from '../model/constants/compare-setting-groups';
import { ProcurementPricecomparisonCompareSettingGridLayoutComponent } from '../components/setting/compare-setting-grid-layout/compare-setting-grid-layout.component';
import { ProcurementPricecomparisonCompareSettingQuoteColumnComponent } from '../components/setting/compare-setting-quote-column/compare-setting-quote-column.component';
import { ProcurementPricecomparisonCompareSettingQuoteFieldComponent } from '../components/setting/compare-setting-quote-field/compare-setting-quote-field.component';
import { ProcurementPricecomparisonCompareSettingBillingSchemaFieldComponent } from '../components/setting/compare-setting-billing-schema-field/compare-setting-billing-schema-field.component';
import { ProcurementPricecomparisonCompareSettingCompareFieldComponent } from '../components/setting/compare-setting-compare-field/compare-setting-compare-field.component';

/**
 * Service to handle the opening of the Compare Setting Dialog.
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementPricecomparisonCompareSettingDialogService {
	private readonly dialogService = inject(UiCommonDialogService);

	private createDefaultSections(): ICompareSettingSection[] {
		return [{
			id: CompareSettingGroups.gridLayout.id,
			title: CompareSettingGroups.gridLayout.title,
			component: ProcurementPricecomparisonCompareSettingGridLayoutComponent,
			order: 1
		}, {
			id: CompareSettingGroups.quoteColumn.id,
			title: CompareSettingGroups.quoteColumn.title,
			component: ProcurementPricecomparisonCompareSettingQuoteColumnComponent,
			expanded: true,
			order: 2
		}, {
			id: CompareSettingGroups.quoteField.id,
			title: CompareSettingGroups.quoteField.title,
			component: ProcurementPricecomparisonCompareSettingQuoteFieldComponent,
			order: 3
		}, {
			id: CompareSettingGroups.billingSchemaField.id,
			title: CompareSettingGroups.billingSchemaField.title,
			component: ProcurementPricecomparisonCompareSettingBillingSchemaFieldComponent,
			order: 4
		}, {
			id: CompareSettingGroups.compareField.id,
			title: CompareSettingGroups.compareField.title,
			component: ProcurementPricecomparisonCompareSettingCompareFieldComponent,
			expanded: true,
			order: 5
		}];
	}

	/**
	 * Show setting dialog.
	 * @param settings - Setting info.
	 * @param settingDialogOptions - dialog options.
	 */
	public async show<
		T extends ICompositeBaseEntity<T>,
		ST extends ICompareSettingBase<T>
	>(
		settings: () => Promise<ST>,
		settingDialogOptions?: ICompareSettingDialogOptions<T, ST>
	): Promise<ST | null> {
		const editorOptions: ICompareSettingDialogOptions<T, ST> = {
			width: '1000px',
			minHeight: '500px',
			headerText: {
				text: 'Compare Config Dialog',
				key: 'procurement.pricecomparison.compareConfigDialog'
			},
			buttons: [{
				id: StandardDialogButtonId.Ok,
				isDisabled: (info: IDialogButtonEventInfo<ICompareSettingEditorDialog<T, ST>, void>) => {
					return info.dialog.loading;
				}
			}, {
				id: StandardDialogButtonId.Cancel
			}],
			...settingDialogOptions,
			resizeable: true,
		};
		const context: ICompareSettingDialogContext<T, ST> = {
			settings: settings,
			sections: this.createDefaultSections().concat(settingDialogOptions?.customSections ? settingDialogOptions.customSections : []).sort((a, b) => a.order - b.order)
		};
		if (settingDialogOptions?.handleSectionsFn) {
			context.sections = settingDialogOptions.handleSectionsFn(context.sections);
		}

		const bodyProviders: StaticProvider[] = [{
			provide: COMPARE_SETTING_DLG_CONTEXT_TOKEN,
			useValue: context
		}];

		settingDialogOptions?.customSections?.forEach(s => {
			if (s.providers) {
				bodyProviders.push(...s.providers);
			}
		});

		const customOptions = this.dialogService.createOptionsForCustom<ICompareSettingEditorDialog<T, ST>, ICompareSettingDialogOptions<T, ST>, ST, ProcurementPricecomparisonCompareSettingDialogBodyComponent<T, ST>>(editorOptions, info => info.body.dialogInfo, ProcurementPricecomparisonCompareSettingDialogBodyComponent<T, ST>, bodyProviders);

		const result = await this.dialogService.show(customOptions);
		return result && result.closingButtonId === StandardDialogButtonId.Ok && result.value ? result.value as ST : null;
	}
}