/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, StaticProvider, Type } from '@angular/core';
import { Translatable } from '@libs/platform/common';
import { IConHeaderEntity } from '@libs/procurement/interfaces';
import { IClosingDialogButtonEventInfo, IDialogButtonBase, IDialogButtonEventInfo, IEditorDialogOptions, StandardDialogButtonId, UiCommonDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { ICompareDataManager } from '../model/entities/compare-data-manager.interface';
import { ProcurementPricecomparisonCompareDataSaveNewComponent } from '../components/data/compare-data-save-new-version/compare-data-save-new-version.component';
import { ProcurementPricecomparisonCompareExportUserDecisionComponent } from '../components/export/compare-export-user-decision/compare-export-user-decision.component';
import { ICompareExportUserDecisionEditorDialog } from '../model/entities/export/compare-export-user-decision-editor-dialog.interface';
import { IAsyncActionEditorDialog } from '../model/entities/dialog/async-action-editor-dialog.interface';
import { ProcurementPricecomparisonCreateContractResultComponent } from '../components/wizard/create-contract-result/create-contract-result.component';
import { CreateContractMode } from '../model/entities/wizard/custom-compare-column-composite.interface';
import { ProcurementPricecomparisonCreateContractShowOptionViewComponent } from '../components/wizard/create-contract-show-option-view/create-contract-show-option-view.component';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPricecomparisonCompareCommonDialogService {
	private readonly dlgSvc = inject(UiCommonDialogService);
	private readonly msgBoxSvc = inject(UiCommonMessageBoxService);

	/**
	 * Show dialog with async action button.
	 * @param options
	 */
	public async showAsyncActionDialog<TValue, TBody extends { dialogInfo: TDialog }, TDialog extends IAsyncActionEditorDialog<TValue> = IAsyncActionEditorDialog<TValue>>(
		options: {
			headerText: Translatable,
			bodyComponent: Type<TBody>,
			defaultButton: Partial<IDialogButtonBase<TDialog>>,
			cancelButton?: Partial<IDialogButtonBase<TDialog>>,
			value?: TValue,
			provider?: StaticProvider[],
			dialogOptions?: IEditorDialogOptions<TValue, TDialog>
		}) {
		const editorOptions: IEditorDialogOptions<TValue, TDialog> = {
			headerText: options.headerText,
			showCloseButton: true,
			buttons: [{
				id: StandardDialogButtonId.Ok,
				caption: 'cloud.common.ok',
				autoClose: false,
				isDisabled: (info: IDialogButtonEventInfo<TDialog, void>) => {
					return info.dialog.loading;
				},
				...options.defaultButton
			}, {
				id: StandardDialogButtonId.Cancel,
				...options.cancelButton
			}],
			value: options.value,
			resizeable: true,
			...options.dialogOptions
		};

		const customOptions = this.dlgSvc.createOptionsForCustom<TDialog, IEditorDialogOptions<TValue, TDialog>, TValue, TBody>(editorOptions, info => info.body.dialogInfo, options.bodyComponent, options.provider);

		return await this.dlgSvc.show<TValue, TBody>(customOptions);
	}

	/**
	 *
	 * @param managers
	 * @param headerText
	 */
	public async showReloadInfoDialog(managers: ICompareDataManager[], headerText?: string) {
		const result = await this.msgBoxSvc.showYesNoDialog({
			headerText: 'cloud.common.infoBoxHeader',
			bodyText: headerText ?? 'procurement.pricecomparison.saveToOriginalDoneAskReload',
			showCancelButton: false
		});
		if (result && result.closingButtonId === StandardDialogButtonId.Yes) {
			managers.forEach(mgr => {
				mgr.reload();
			});
		}
	}

	/**
	 *
	 */
	public async showReloadNewVersionDialog() {
		return await this.msgBoxSvc.showYesNoDialog({
			headerText: 'cloud.common.infoBoxHeader',
			bodyText: 'procurement.pricecomparison.saveToNewVersionDone',
			showCancelButton: false
		});
	}

	/**
	 *
	 */
	public async showSaveNewVersionDialog() {
		return this.dlgSvc.show({
			headerText: 'procurement.pricecomparison.saveToNewVersion',
			bodyComponent: ProcurementPricecomparisonCompareDataSaveNewComponent,
			showCloseButton: true,
			value: false,
			buttons: [{
				id: StandardDialogButtonId.Ok
			}, {
				id: StandardDialogButtonId.Cancel
			}]
		});
	}

	public async showExportExcelDialog(ok: (info: IClosingDialogButtonEventInfo<ICompareExportUserDecisionEditorDialog, void>) => Promise<void>) {
		const editorOptions: IEditorDialogOptions<boolean, ICompareExportUserDecisionEditorDialog> = {
			headerText: 'procurement.pricecomparison.wizard.exportPriceComparison',
			showCloseButton: true,
			value: false,
			buttons: [{
				id: 'export',
				caption: 'cloud.common.ok',
				autoClose: false,
				fn: async (event: MouseEvent, info: IClosingDialogButtonEventInfo<ICompareExportUserDecisionEditorDialog, void>) => {
					info.dialog.loading = true;
					await ok(info);
					info.dialog.close(info.button.id);
				},
				isDisabled: (info: IDialogButtonEventInfo<ICompareExportUserDecisionEditorDialog, void>) => {
					return info.dialog.loading;
				}
			}, {
				id: StandardDialogButtonId.Cancel
			}]
		};
		const customOptions = this.dlgSvc.createOptionsForCustom<ICompareExportUserDecisionEditorDialog, IEditorDialogOptions<boolean, ICompareExportUserDecisionEditorDialog>, boolean, ProcurementPricecomparisonCompareExportUserDecisionComponent>(editorOptions, info => info.body.dialogInfo, ProcurementPricecomparisonCompareExportUserDecisionComponent);

		return await this.dlgSvc.show(customOptions);
	}

	public async showOptionDialog(
		fn: (event: MouseEvent, info: IClosingDialogButtonEventInfo<IAsyncActionEditorDialog<CreateContractMode>, void>) => Promise<void>
	) {
		return this.showAsyncActionDialog<CreateContractMode, ProcurementPricecomparisonCreateContractShowOptionViewComponent>({
			headerText: 'procurement.quote.wizard.create.contract.title',
			bodyComponent: ProcurementPricecomparisonCreateContractShowOptionViewComponent,
			defaultButton: {
				fn: async (event: MouseEvent, info: IClosingDialogButtonEventInfo<IAsyncActionEditorDialog<CreateContractMode>, void>) => {
					return await fn(event, info);
				}
			},
			value: CreateContractMode.Multiple
		});
	}

	public showCreateContractResultDialog(contracts: IConHeaderEntity[]) {
		return this.dlgSvc.show<IConHeaderEntity[], ProcurementPricecomparisonCreateContractResultComponent>({
			headerText: 'procurement.pricecomparison.wizard.createContract',
			bodyComponent: ProcurementPricecomparisonCreateContractResultComponent,
			showCloseButton: true,
			value: contracts,
			buttons: [{
				id: 'goto',
				caption: 'procurement.common.GoToContract',
				fn: () => {
					const ids = contracts.map((item) => {
						return item.Id;
					});
					if (ids.length > 0) {
						// TODO-DRIZZLE: To be checked.
						/*platformModuleNavigationService.navigate({
							moduleName: 'procurement.contract',
							registerService: 'procurementContractHeaderDataService'
						}, ids);*/
					}
				},
				isDisabled: () => {
					return contracts.length > 0;
				}
			}, {
				id: StandardDialogButtonId.Cancel
			}]
		});
	}
}