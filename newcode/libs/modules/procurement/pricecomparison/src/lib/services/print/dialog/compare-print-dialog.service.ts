/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, StaticProvider } from '@angular/core';
import { IClosingDialogButtonEventInfo, IDialogButtonBase, IDialogButtonEventInfo, IEditorDialog, IEditorDialogOptions, StandardDialogButtonId, UiCommonDialogService } from '@libs/ui/common';
import { ICompositeBaseEntity } from '../../../model/entities/composite-base-entity.interface';
import { IComparePrintDialogContext, IComparePrintDialogEvents, IComparePrintDialogOptions, IComparePrintEditorDialog, IComparePrintSection } from '../../../model/entities/print/compare-print-dialog-options.interface';
import { IComparePrintBase } from '../../../model/entities/print/compare-print-base.interface';
import { COMPARE_PRINT_DLG_CONTEXT_TOKEN, ProcurementPricecomparisonComparePrintDialogBodyComponent } from '../../../components/print/compare-print-dialog-body/compare-print-dialog-body.component';
import { ComparePrintPages } from '../../../model/constants/compare-print-pages';
import { ProcurementPricecomparisonComparePrintLayoutPageComponent } from '../../../components/print/pages/compare-print-layout-page/compare-print-layout-page.component';
import { ProcurementPricecomparisonComparePrintBidderPageComponent } from '../../../components/print/pages/compare-print-bidder-page/compare-print-bidder-page.component';
import { ProcurementPricecomparisonComparePrintReportSettingPageComponent } from '../../../components/print/pages/compare-print-report-setting-page/compare-print-report-setting-page.component';
import { ProcurementPricecomparisonComparePrintColumnSettingPageComponent } from '../../../components/print/pages/compare-print-column-setting-page/compare-print-column-setting-page.component';
import { ProcurementPricecomparisonComparePrintRowSettingPageComponent } from '../../../components/print/pages/compare-print-row-setting-page/compare-print-row-setting-page.component';
import { ProcurementPricecomparisonComparePrintProfileSelectorComponent } from '../../../components/print/profiles/compare-print-profile-selector/compare-print-profile-selector.component';
import { CompareProfileSaveTypes } from '../../../model/enums/compare-profile-save-types.enum';
import { COMPARE_PRINT_DLG_SAVE_PROFILE_CONTEXT_TOKEN, ProcurementPricecomparisonComparePrintProfileSaveComponent } from '../../../components/print/profiles/compare-print-profile-save/compare-print-profile-save.component';
import { IComparePrintSaveProfileDialogContext, IComparePrintSaveProfileDialogEvents, IComparePrintSaveProfileDialogOptions, IComparePrintSaveProfileEditorDialog } from '../../../model/entities/print/compare-print-save-profile-options.interface';
import { IComparePrintProfileEntity } from '../../../model/entities/print/compare-print-profile-entity.interface';
import { CompareProfileTypes } from '../../../model/enums/compare-profile-types.enum';

/**
 * Service to handle the opening of the Compare Print Dialog.
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementPricecomparisonComparePrintDialogService {
	private readonly dialogService = inject(UiCommonDialogService);

	private createDefaultSections(): IComparePrintSection[] {
		return [{
			id: ComparePrintPages.pageLayout.id,
			title: ComparePrintPages.pageLayout.title,
			component: ProcurementPricecomparisonComparePrintLayoutPageComponent,
			order: 1
		}, {
			id: ComparePrintPages.bidder.id,
			title: ComparePrintPages.bidder.title,
			component: ProcurementPricecomparisonComparePrintBidderPageComponent,
			order: 2
		}, {
			id: ComparePrintPages.reportSetting.id,
			title: ComparePrintPages.reportSetting.title,
			component: ProcurementPricecomparisonComparePrintReportSettingPageComponent,
			order: 3
		}, {
			id: ComparePrintPages.columnSetting.id,
			title: ComparePrintPages.columnSetting.title,
			component: ProcurementPricecomparisonComparePrintColumnSettingPageComponent,
			order: 4
		}, {
			id: ComparePrintPages.rowSetting.id,
			title: ComparePrintPages.rowSetting.title,
			component: ProcurementPricecomparisonComparePrintRowSettingPageComponent,
			order: 5
		}];
	}

	private mergeButtons<
		T extends ICompositeBaseEntity<T>,
		PT extends IComparePrintBase<T>
	>(
		basicButtons: IDialogButtonBase<IComparePrintEditorDialog<T, PT>>[],
		buttons?: IDialogButtonBase<IComparePrintEditorDialog<T, PT>>[]
	): IDialogButtonBase<IComparePrintEditorDialog<T, PT>>[] {
		const results = [...basicButtons];
		buttons?.forEach(btn => {
			const target = results.find(e => e.id === btn.id);
			if (target) {
				Object.assign(target, btn);
			} else {
				results.push(btn);
			}
		});
		return results;
	}

	/**
	 * Show print dialog.
	 * @param settings - print info.
	 * @param settingDialogOptions - dialog options.
	 * @param events - dialog events
	 */
	public async show<
		T extends ICompositeBaseEntity<T>,
		PT extends IComparePrintBase<T>
	>(
		settings: () => Promise<PT>,
		settingDialogOptions: IComparePrintDialogOptions<T, PT>,
		events?: IComparePrintDialogEvents<T, PT>
	): Promise<PT | null> {
		const editorOptions: IComparePrintDialogOptions<T, PT> = {
			width: '1200px',
			minHeight: '500px',
			minWidth: '1200px',
			headerText: settingDialogOptions.headerText,
			...settingDialogOptions,
			buttons: this.mergeButtons([{
				id: 'saveAs',
				caption: {
					key: 'basics.common.button.saveAs',
				},
				isDisabled: (info: IDialogButtonEventInfo<IComparePrintEditorDialog<T, PT>, void>) => {
					return info.dialog.loading;
				}
			}, {
				id: 'preview',
				caption: {
					key: 'basics.common.button.preview'
				},
				isDisabled: (info: IDialogButtonEventInfo<IComparePrintEditorDialog<T, PT>, void>) => {
					return info.dialog.loading;
				}
			}, {
				id: 'print',
				caption: {
					key: 'procurement.pricecomparison.printing.print'
				},
				fn: (event: MouseEvent, info: IClosingDialogButtonEventInfo<IComparePrintEditorDialog<T, PT>, void>) => {
					info.dialog.loading = true;
				},
				isDisabled: (info: IDialogButtonEventInfo<IComparePrintEditorDialog<T, PT>, void>) => {
					return info.dialog.loading;
				}
			}, {
				id: 'save',
				caption: {
					key: 'cloud.common.ok'
				},
				isDisabled: (info: IDialogButtonEventInfo<IComparePrintEditorDialog<T, PT>, void>) => {
					return info.dialog.loading;
				}
			}], settingDialogOptions.buttons),
			resizeable: true,
		};
		const context: IComparePrintDialogContext<T, PT> = {
			settings: settings,
			sections: this.createDefaultSections().concat(settingDialogOptions?.customSections ? settingDialogOptions.customSections : []).sort((a, b) => a.order - b.order),
			events: events
		};
		if (settingDialogOptions?.handleSectionsFn) {
			context.sections = settingDialogOptions.handleSectionsFn(context.sections);
		}

		const bodyProviders: StaticProvider[] = [{
			provide: COMPARE_PRINT_DLG_CONTEXT_TOKEN,
			useValue: context
		}];

		settingDialogOptions?.customSections?.forEach(s => {
			if (s.providers) {
				bodyProviders.push(...s.providers);
			}
		});

		const customOptions = this.dialogService.createOptionsForCustom<IComparePrintEditorDialog<T, PT>, IComparePrintDialogOptions<T, PT>, PT, ProcurementPricecomparisonComparePrintDialogBodyComponent<T, PT>>(editorOptions, info => info.body.dialogInfo, ProcurementPricecomparisonComparePrintDialogBodyComponent<T, PT>, bodyProviders);

		const result = await this.dialogService.show(customOptions);
		return result && result.closingButtonId === StandardDialogButtonId.Ok && result.value ? result.value as PT : null;
	}

	public async showSaveAs(): Promise<CompareProfileSaveTypes | null> {
		const editorOptions: IEditorDialogOptions<CompareProfileSaveTypes, IEditorDialog<CompareProfileSaveTypes>> = {
			width: '600px',
			minHeight: '200px',
			minWidth: '600px',
			headerText: 'procurement.pricecomparison.printing.saveProfile',
			buttons: [{
				id: 'next',
				caption: {
					key: 'basics.common.button.nextStep'
				}
			}],
			resizeable: false,
			value: CompareProfileSaveTypes.generic
		};
		const customOptions = this.dialogService.createOptionsForCustom<IEditorDialog<CompareProfileSaveTypes>, IEditorDialogOptions<CompareProfileSaveTypes, IEditorDialog<CompareProfileSaveTypes>>, CompareProfileSaveTypes, ProcurementPricecomparisonComparePrintProfileSelectorComponent>(editorOptions, info => info.body.dialogInfo, ProcurementPricecomparisonComparePrintProfileSelectorComponent, []);
		const result = await this.dialogService.show(customOptions);
		return result && result.closingButtonId === 'next' && result.value ? result.value as CompareProfileSaveTypes : null;
	}

	public async showSaveAsProfile(
		rfqHeaderId: number,
		profileType: CompareProfileTypes,
		profileSaveType: CompareProfileSaveTypes,
		profiles: IComparePrintProfileEntity[],
		events: IComparePrintSaveProfileDialogEvents
	): Promise<IComparePrintProfileEntity[] | null> {
		const editorOptions: IComparePrintSaveProfileDialogOptions = {
			width: '600px',
			minHeight: '200px',
			minWidth: '600px',
			headerText: 'procurement.pricecomparison.printing.saveProfile',
			buttons: [{
				id: StandardDialogButtonId.Ok,
				autoClose: false,
				isDisabled: (info) => {
					return !info.dialog.profile || !info.dialog.profileName;
				},
				fn: async (event, info) => {
					info.dialog.loading = true;
					const profile = info.dialog.profile && info.dialog.profile.Description === info.dialog.profileName
						? info.dialog.profile
						: {
							Id: -1,
							RfqHeaderFk: profileSaveType === CompareProfileSaveTypes.generic ? null : rfqHeaderId,
							Description: info.dialog.profileName,
							ProfileType: profileType,
							IsSystem: false,
							IsDefault: false,
							DisplayText: '',
							PropertyConfig: ''
						} as IComparePrintProfileEntity;
					// TODO-DRIZZLE: To be checked.
					// profile.PropertyConfig = JSON.stringify(processSorting(profile));
					profile.PropertyConfig = JSON.stringify(events.toPropertyConfig(profile));
					await events.save(info.dialog.location, profile, info.dialog.profiles);
					info.dialog.loading = false;
					info.dialog.close(info.button.id);
				}
			}, {
				id: StandardDialogButtonId.Cancel
			}],
			resizeable: false,
			customButtons: [{
				id: 'delete',
				caption: {
					key: 'ui.common.dialog.deleteBtn'
				},
				autoClose: false,
				isDisabled: (info) => {
					return !info.dialog.profile;
				},
				fn: async (event, info) => {
					info.dialog.loading = true;
					await events.delete(info.dialog.profile as IComparePrintProfileEntity, info.dialog.profiles);
					info.dialog.loading = false;
				}
			}, {
				id: 'default',
				caption: {
					key: 'ui.common.dialog.defaultButton'
				},
				autoClose: false,
				isDisabled: (info) => {
					return !info.dialog.profile;
				},
				fn: async (event, info) => {
					info.dialog.loading = true;
					await events.setDefault(info.dialog.location, info.dialog.profile as IComparePrintProfileEntity, info.dialog.profiles);
					info.dialog.loading = false;
				}
			}],
		};

		const context: IComparePrintSaveProfileDialogContext = {
			profiles: profiles,
			events: events
		};

		const bodyProviders: StaticProvider[] = [{
			provide: COMPARE_PRINT_DLG_SAVE_PROFILE_CONTEXT_TOKEN,
			useValue: context
		}];

		const customOptions = this.dialogService.createOptionsForCustom<IComparePrintSaveProfileEditorDialog, IComparePrintSaveProfileDialogOptions, [], ProcurementPricecomparisonComparePrintProfileSaveComponent>(editorOptions, info => info.body.dialogInfo, ProcurementPricecomparisonComparePrintProfileSaveComponent, bodyProviders);
		const result = await this.dialogService.show(customOptions);
		return result && result.closingButtonId === StandardDialogButtonId.Ok && result.value ? result.value as IComparePrintProfileEntity[] : null;
	}
}