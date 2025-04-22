/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ICustomDialogOptions, IMessageBoxOptions, StandardDialogButtonId, UiCommonDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { ProcurementCommonCreateContractDialogComponent } from '../../../components/create-contract/create-contract-dialog.component';
import { PlatformHttpService, PlatformLazyInjectorService, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { IConHeaderEntity, IHasContractedDataRequest, IPackage2HeaderEntity, IPrcPackageEntity, PACKAGE_2HEADER_DATA_PROVIDER, PACKAGE_HEADER_DATA_PROVIDER } from '@libs/procurement/interfaces';
import { IConfirmCreateContractResponse } from '../../../model/response/confirm-create-contract-response';
import { ProcurementCreateContractMode } from '../../../model/enums';
import { ProcurementPackageCreateContractChangeOrderComponent } from '../../../components/create-contract-change-order/create-contract-change-order.component';
import { ProcurementCommonCreateContractWizardHelperService } from './procurement-common-create-contract-wizard-helper.service';
import { CREATE_CONTRACT_WIZARD_OPTIONS_TOKEN } from '../../../model/interfaces/wizard/create-contract-wizard-provider.interface';


@Injectable({
	providedIn: 'root',
})
export class ProcurementCommonCreateContractWizardService {
	private readonly http = inject(PlatformHttpService);
	private readonly dialogService = inject(UiCommonDialogService);
	private readonly lazyInjector = ServiceLocator.injector.get(PlatformLazyInjectorService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly msgBoxService = inject(UiCommonMessageBoxService);
	private readonly createContractWizardHelperService = inject(ProcurementCommonCreateContractWizardHelperService);
	public getPackageChangeOrderDialogOptions(packageData: IPrcPackageEntity, subpackageData: IPackage2HeaderEntity, hasContractItem: boolean, changeOrderData: IConfirmCreateContractResponse, arrayExistedValidBaseContract: IConHeaderEntity[]) {

		const dialogOptions: ICustomDialogOptions<StandardDialogButtonId, ProcurementPackageCreateContractChangeOrderComponent> = {
			bodyComponent: ProcurementPackageCreateContractChangeOrderComponent,
			headerText: 'procurement.package.wizard.contract.header',
			buttons: [
				{
					caption: { key: 'cloud.common.ok' },
					autoClose: false,
					isDisabled: (info) => {
						return info.dialog.body.componentConfig.oKButtonDisable;
					},
					id: 'ok',
					fn: async (event, info) => {
						await info.dialog.body.onOk();
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
			],
			bodyProviders: [
				{
					provide: CREATE_CONTRACT_WIZARD_OPTIONS_TOKEN,
					useValue: {
						package: packageData,
						subPackage: subpackageData,
						hasContractItem: hasContractItem,
						changeOrderData: changeOrderData,
						changeOrderContract: arrayExistedValidBaseContract,
						mode:ProcurementCreateContractMode.Package
					},
				},
			],
		};
		return dialogOptions;
	}

	private getPackageCreateContractDialogOptions(packageData: IPrcPackageEntity, subpackageData: IPackage2HeaderEntity, hasContractItem: boolean, changeOrderData: IConfirmCreateContractResponse) {
		const buttonConfig=this.createContractWizardHelperService.getCreateContractButtonConfig();
		const dialogOptions: ICustomDialogOptions<StandardDialogButtonId, ProcurementCommonCreateContractDialogComponent> = {
			bodyComponent: ProcurementCommonCreateContractDialogComponent,
			headerText: 'procurement.package.wizard.contract.header',
			buttons: buttonConfig,
			bodyProviders: [
				{
					provide: CREATE_CONTRACT_WIZARD_OPTIONS_TOKEN,
					useValue: {
						package: packageData,
						subPackage: subpackageData,
						hasContractItem: hasContractItem,
						changeOrderData: changeOrderData,
						mode:ProcurementCreateContractMode.Package
					},
				},
			],
		};
		return dialogOptions;
	}

	public async createContract(CreateContractMode: ProcurementCreateContractMode) {
		switch (CreateContractMode) {
			case ProcurementCreateContractMode.Req:
				await this.createContractByPackage();
				break;
			case ProcurementCreateContractMode.Quote:
				break;
			case ProcurementCreateContractMode.Package: {
				await this.createContractByPackage();
				break;
			}
		}
	}

	private async createContractByPackage() {
		const messageBoxConfig: IMessageBoxOptions = {
			headerText: 'cloud.common.informationDialogHeader',
			bodyText: this.translateService.instant('procurement.package.wizard.contract.selectOnoPackage').text,
			iconClass: 'ico-info',
		};
		// region check package
		const package2HeaderDataService = await this.lazyInjector.inject(PACKAGE_2HEADER_DATA_PROVIDER);
		const procurementPackageHeaderDataService = await this.lazyInjector.inject(PACKAGE_HEADER_DATA_PROVIDER);
		const selectedPackage = procurementPackageHeaderDataService.getSelectedEntity();
		if (!selectedPackage) {
			this.msgBoxService.showMsgBox(messageBoxConfig);
			return;
		}
		// endregion
		// region check Package2header
		const dataPackage2header = await this.http.get<IPackage2HeaderEntity[]>('procurement/package/prcpackage2header/getSubPackage', { params: { prcPackage: selectedPackage.Id } });
		//todo
		// params.isTriggeredByWorkflow add in this judge
		// var subPackage = params.isTriggeredByWorkflow ? result.data[0] : subPackageDataService.getSelected();
		let subPackage: IPackage2HeaderEntity | null = null;
		const selectedPackage2Header: IPackage2HeaderEntity | null = package2HeaderDataService.getSelectedEntity();
		if (dataPackage2header && dataPackage2header[0]) {
			subPackage = dataPackage2header[0];
		} else if (selectedPackage2Header) {
			subPackage = selectedPackage2Header;
		}
		if (!subPackage) {
			messageBoxConfig.bodyText = this.translateService.instant('procurement.package.wizard.contract.noSubPackage').text;
			this.msgBoxService.showMsgBox(messageBoxConfig);
			return;
		}
		// endregion
		// region check confirmCreateContractOption
		const resultConfirmCreateContract = await this.http.get<IConfirmCreateContractResponse>('procurement/contract/wizard/confirmcreatecontractoption?subPackageId=' + subPackage.Id);
		if (resultConfirmCreateContract && resultConfirmCreateContract.changeItems && resultConfirmCreateContract.changeItems.length <= 0) {
			messageBoxConfig.bodyText = this.translateService.instant('procurement.package.wizard.contract.noChangeFound').text;
			this.msgBoxService.showMsgBox(messageBoxConfig);
			return;
		}
		// endregion
		// region check has contracted data and show dialog
		const hasContractedDataRequest: IHasContractedDataRequest = {
			MainItemIds: [subPackage.PrcHeaderFk],
			ModuleName: 'procurement.package',
		};
		const resultHasContractedDataRequest = await this.http.post<boolean>('procurement/common/wizard/hascontracteddata', hasContractedDataRequest);
		if (resultConfirmCreateContract && resultConfirmCreateContract.contracts) {
			// region change order
			const dialogOptions = this.getPackageChangeOrderDialogOptions(selectedPackage, subPackage, resultHasContractedDataRequest, resultConfirmCreateContract, resultConfirmCreateContract.contracts);
			await this.dialogService.show(dialogOptions);
			// endregion
		} else {
			//todo
			// package: params.isTriggeredByWorkflow ? selecsstedPackage : null,
			// subPackage: params.isTriggeredByWorkflow ? subPackage : null,
			// add params.isTriggeredByWorkflow
			//todo
			// resultPromise: params.isTriggeredByWorkflow ? params.resultPromise : null
			const dialogOptions = this.getPackageCreateContractDialogOptions(selectedPackage, subPackage, resultHasContractedDataRequest, resultConfirmCreateContract);
			await this.dialogService.show(dialogOptions);
		}

		// endregion
	}

}
