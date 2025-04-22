import { inject, Injectable } from '@angular/core';
import { createLookup, FieldType, ICustomDialog, IDialogButtonBase, IFieldValueChangeInfo, IFormConfig, ILookupSearchRequest, IMessageBoxOptions, StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { BusinessPartnerLookupService, BusinesspartnerSharedContactLookupService, BusinesspartnerSharedSubsidiaryLookupService, BusinesspartnerSharedSupplierLookupService } from '@libs/businesspartner/shared';
import { PlatformLazyInjectorService, PlatformModuleNavigationService, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { IConHeaderEntity } from '@libs/procurement/interfaces';
import { BUSINESS_PARTNER_HELPER_TOKEN, ContactConditionKeyEnum } from '@libs/businesspartner/interfaces';
import { ICreateContractComponentConfig } from '../../../model/entities';
import { ProcurementCreateContractUpdateReadonlyMode } from '../../../model/enums/procurement-create-contract-update-readonly-mode.enum';
import { ICreateContractWizardForm } from '../../../model/interfaces/wizard/create-contract-wizard-form.interface';
import { ProcurementCommonCreateContractDialogComponent } from '../../../components/create-contract/create-contract-dialog.component';

@Injectable({
	providedIn: 'root',
})
export class ProcurementCommonCreateContractWizardHelperService {
	private readonly translateService = inject(PlatformTranslateService);
	private readonly platformModuleNavigationService = inject(PlatformModuleNavigationService);
	private readonly msgBoxService = inject(UiCommonMessageBoxService);
	private readonly supplierLookupService = inject(BusinesspartnerSharedSupplierLookupService);
	private readonly lazyInjector = ServiceLocator.injector.get(PlatformLazyInjectorService);
	private readonly bpLookupService = inject(BusinessPartnerLookupService);

	public createFromConfiguration(createContractRequests: ICreateContractWizardForm, rowReadonly: boolean, createContractComponentConfig: ICreateContractComponentConfig) {
		const gridConfiguration: IFormConfig<ICreateContractWizardForm> = {
			formId: 'create-contract-form',
			showGrouping: false,
			rows: [
				{
					id: 'BpFK',
					label: {
						text: this.translateService.instant('cloud.common.entityBusinessPartner').text,
					},
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BusinessPartnerLookupService,
						showClearButton: true,
					}),
					model: 'bpFK',
					change: (changeInfo: IFieldValueChangeInfo<ICreateContractWizardForm>) => {
						this.changeBp(createContractRequests, changeInfo, gridConfiguration, createContractComponentConfig);
					},
				},
				{
					id: 'SubsidiaryFk',
					label: {
						text: this.translateService.instant('cloud.common.entitySubsidiary').text,
					},
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService,
					}),
					model: 'subsidiaryFk',
					readonly: rowReadonly,
				},
				{
					id: 'SupplierFk',
					label: {
						text: this.translateService.instant('cloud.common.entitySupplier').text,
					},
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BusinesspartnerSharedSupplierLookupService,
					}),
					model: 'supplierFk',
					readonly: rowReadonly,
				},
				{
					id: 'ContactFk',
					label: {
						text: this.translateService.instant('procurement.package.wizard.contract.contact').text,
					},
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BusinesspartnerSharedContactLookupService,
					}),
					model: 'contactFk',
					readonly: rowReadonly,
				},
			],
		};
		return gridConfiguration;
	}

	public getCreateContractButtonConfig(): IDialogButtonBase<ICustomDialog<StandardDialogButtonId, ProcurementCommonCreateContractDialogComponent, void>, void>[] | undefined {
		const buttonConfig: IDialogButtonBase<ICustomDialog<StandardDialogButtonId, ProcurementCommonCreateContractDialogComponent, void>, void>[] | undefined = [
			{
				caption: { key: 'cloud.common.nextStep' },
				autoClose: false,
				isDisabled: (info) => {
					return info.dialog.body.componentConfig.oKButtonDisable;
				},
				id: 'nextStep',
				fn: async (event, info) => {
					await info.dialog.body.isNext();
					info.dialog.close();
				},
			},
			{
				id: StandardDialogButtonId.Cancel,
				caption: { key: 'ui.common.dialog.cancelBtn' },
				fn: (event, info) => {
					info.dialog.close();
				},
				isDisabled: (info) => {
					return info.dialog.body.componentConfig.cancelButtonDisable;
				},
			},
		];
		return buttonConfig;
	}

	public changeBp(
		createContractRequestsEntity: ICreateContractWizardForm,
		changeInfo: IFieldValueChangeInfo<ICreateContractWizardForm>,
		gridConfiguration: IFormConfig<ICreateContractWizardForm>,
		createContractComponentConfig: ICreateContractComponentConfig,
	) {
		if (changeInfo.entity.bpFK > 0 && changeInfo.newValue !== changeInfo.oldValue) {
			this.updateReadonly(false, gridConfiguration, ProcurementCreateContractUpdateReadonlyMode.ExceptForBPReadonly);
			this.getOtherDataByBp(changeInfo, createContractRequestsEntity);
			createContractComponentConfig.oKButtonDisable = false;
			// endregion
			//todo dont know need?
			// if(selectedItem && selectedItem.ContactFromBpDialog){
			// 	$scope.initOptions.dataModels.contact.Id = selectedItem.ContactFk;
			// 	selectedItem.ContactFromBpDialog = false;
		} else {
			this.updateReadonly(true, gridConfiguration, ProcurementCreateContractUpdateReadonlyMode.ExceptForBPReadonly);
			createContractRequestsEntity.contactFk = null;
			createContractRequestsEntity.subsidiaryFk = null;
			createContractRequestsEntity.supplierFk = null;
			createContractComponentConfig.oKButtonDisable = true;
		}
	}

	public getOtherDataByBp(changeInfo: IFieldValueChangeInfo<ICreateContractWizardForm>, createContractRequestsEntity: ICreateContractWizardForm) {
		this.bpLookupService.getItemByKeyAsync({ id: changeInfo.entity.bpFK }).then((dataBp) => {
			// this.updateReadonly(info.newValue as boolean);
			if (dataBp && dataBp.SubsidiaryFk) {
				createContractRequestsEntity.subsidiaryFk = dataBp.SubsidiaryFk;
				const searchRequest: ILookupSearchRequest = {
					searchFields: ['Code', 'Description', 'BusinessPartnerName1'],
					searchText: '',
					additionalParameters: {
						SubsidiaryFk: dataBp.SubsidiaryFk,
						BusinessPartnerFk: dataBp.Id,
					},
					filterKey: 'businesspartner-main-supplier-common-filter',
					treeState: {},
				};
				// region get supplier
				this.supplierLookupService.getSearchListAsync(searchRequest).then((lookupSupplier) => {
					if (lookupSupplier && lookupSupplier.items[0]) {
						createContractRequestsEntity.supplierFk = lookupSupplier.items[0].Id;
					}
					// endregion
					// region get contract
					this.lazyInjector.inject(BUSINESS_PARTNER_HELPER_TOKEN).then((businessPartnerHelper) => {
						if (businessPartnerHelper) {
							businessPartnerHelper.getDefaultContactByBranch(ContactConditionKeyEnum.IsProcurement, dataBp.Id, dataBp.SubsidiaryFk).then((dataContact) => {
								if (dataContact) {
									createContractRequestsEntity.contactFk = dataContact.Id;
								}
							});
						}
					});
				});
				// endregion
				//todo dont know need?
				// if(selectedItem && selectedItem.ContactFromBpDialog){
				// 	$scope.initOptions.dataModels.contact.Id = selectedItem.ContactFk;
				// 	selectedItem.ContactFromBpDialog = false;
			}
		});
	}

	public async showCreateSuccessfully(dataContract: IConHeaderEntity) {
		const codeText = this.translateService.instant('procurement.package.wizard.contract.newCode', { newCode: dataContract.Code }).text;
		const successText = this.translateService.instant('procurement.package.wizard.contract.createNewBaseContractSuccessfully').text;
		//todo br no use,need double row
		const bodyText = successText + '\n' + codeText;
		const successDialogConfig: IMessageBoxOptions = {
			buttons: [
				{
					id: 'GoToContract',
					caption: 'procurement.common.GoToContract',
					fn: async (event, info) => {
						await this.platformModuleNavigationService.navigate({
							internalModuleName: 'procurement.contract',
							entityIdentifications: [{ id: dataContract.Id }],
						});
						info.dialog.close();
					},
				},
				{
					id: 'messageBoxClose',
					caption: { key: 'cloud.common.close' },
					fn: async (event, info) => {
						info.dialog.close();
					},
				},
			],
			iconClass: 'ico-info',
			id: 'YesNoModal',
			headerText: this.translateService.instant('procurement.package.wizard.createContract').text,
			bodyText: bodyText,
		};
		await this.msgBoxService.showMsgBox(successDialogConfig);
	}

	public async showError(text = 'procurement.package.wizard.contract.fail') {
		const errorDialogConfig: IMessageBoxOptions = {
			bodyText: this.translateService.instant(text).text,
			iconClass: 'ico-error',
		};
		this.msgBoxService.showMsgBox(errorDialogConfig);
	}

	// region readonly
	public updateReadonly(isReadonly: boolean, formConfig: IFormConfig<ICreateContractWizardForm>, readonlyMode: ProcurementCreateContractUpdateReadonlyMode) {
		formConfig.rows.forEach((row) => {
			switch (readonlyMode) {
				case ProcurementCreateContractUpdateReadonlyMode.ExceptForBPReadonly: {
					if (row.id !== 'BpFK') {
						row.readonly = isReadonly;
					}
					break;
				}
				case ProcurementCreateContractUpdateReadonlyMode.AllReadonly: {
					row.readonly = isReadonly;
					break;
				}
				case ProcurementCreateContractUpdateReadonlyMode.OnlyBP: {
					if (row.id === 'BpFK') {
						row.readonly = isReadonly;
					}
				}
			}
		});
	}

	public loadingControl(componentConfig: ICreateContractComponentConfig, result: boolean) {
		componentConfig.isLoading = result;
		componentConfig.oKButtonDisable = result;
		componentConfig.cancelButtonDisable = result;
	}

	// endregion
}
