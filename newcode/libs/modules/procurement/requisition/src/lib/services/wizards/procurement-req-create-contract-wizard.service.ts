/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { ICustomDialogOptions, IMessageBoxOptions, IYesNoDialogOptions, StandardDialogButtonId, UiCommonDialogService, UiCommonMessageBoxService } from '@libs/ui/common';

import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { IConHeaderLookupVEntity, IHasContractedDataRequest, IParameterForCreateChangeContractFromReqRequset, } from '@libs/procurement/interfaces';
import { CREATE_CONTRACT_WIZARD_OPTIONS_TOKEN, ProcurementCommonCreateContractDialogComponent, ProcurementCommonCreateContractWizardHelperService, ProcurementCreateContractMode } from '@libs/procurement/common';
import { ProcurementRequisitionHeaderDataService } from '../requisition-header-data.service';
import { IReqHeaderEntity } from '../../model/entities/reqheader-entity.interface';





@Injectable({
	providedIn: 'root',
})
export class ProcurementReqCreateContractWizardService {
	private readonly http = inject(PlatformHttpService);
	private readonly dialogService = inject(UiCommonDialogService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly msgBoxService = inject(UiCommonMessageBoxService);
	private readonly requisitionHeaderDataService = inject(ProcurementRequisitionHeaderDataService);
	private readonly createContractWizardHelperService = inject(ProcurementCommonCreateContractWizardHelperService);

	public async createContractByReq() {
		const messageBoxConfig: IMessageBoxOptions = {
			headerText: 'cloud.common.informationDialogHeader',
			bodyText: this.translateService.instant('procurement.requisition.contract.cannotCreateContractDueToStatus').text,
			iconClass: 'ico-info',
		};
		// region check package
		const selectedData = this.requisitionHeaderDataService.getSelectedEntity();
		if (selectedData&&selectedData.ReqStatus) {
			if (!selectedData.ReqStatus.Isaccepted || selectedData.ReqStatus.Iscanceled) {
				await this.msgBoxService.showMsgBox(messageBoxConfig);
				return;
			}
			// endregion
			if (selectedData.ReqHeaderFk && selectedData.ProjectChangeFk) {
				const parameters: IParameterForCreateChangeContractFromReqRequset = {
					PackageFk: selectedData.PackageFk,
					SubPackageFk: selectedData.Package2HeaderFk,
					ProjectFk: selectedData.ProjectFk,
				};

				// region getbasecontractforchangereq
				const dataConHeader = await this.http.post<IConHeaderLookupVEntity[]>('procurement/contract/wizard/getbasecontractforchangereq', parameters);
				if (!dataConHeader || dataConHeader.length === 0) {
					messageBoxConfig.bodyText = this.translateService.instant('procurement.requisition.contract.cannotCreateContractDueToNoBaseContract');
					await this.msgBoxService.showMsgBox(messageBoxConfig);
				} else {
					//todo change order
				}
				// endregion
			} else if (selectedData.ReqStatus.Isaccepted && !selectedData.ReqStatus.Iscanceled) {
				if (selectedData.ReqStatus.Isordered) {
					messageBoxConfig.bodyText = this.translateService.instant('procurement.requisition.contract.disableCreateContractByOrdered');
					await this.msgBoxService.showMsgBox(messageBoxConfig);
				} else {
					const request: IHasContractedDataRequest = {
						MainItemIds: [selectedData.PrcHeaderFk],
						ModuleName: 'procurement.requisition',
					};
					const resultHasContractedData = await this.http.post<boolean>('procurement/common/wizard/hascontracteddata', request);
					if (selectedData.BusinessPartnerFk !== null) {
						if (resultHasContractedData) {
							const options: IYesNoDialogOptions = {
								defaultButtonId: StandardDialogButtonId.Yes,
								id: 'YesNoModal',
								dontShowAgain: true,
								showCancelButton: true,
								headerText: this.translateService.instant('basics.config.yesNoDialogTitle').text,
								bodyText: this.translateService.instant('basics.config.yesNoDialogQuestion').text,
							};
							const resultMessageBox = await this.msgBoxService.showYesNoDialog(options);
							if (resultMessageBox?.closingButtonId === StandardDialogButtonId.Yes) {
								const dialogOptions = this.getReqCreateContractDialogOptions(selectedData);
								await this.dialogService.show(dialogOptions);
							}
						} else {
							const dialogOptions = this.getReqCreateContractDialogOptions(selectedData);
							await this.dialogService.show(dialogOptions);
						}
					} else {
						const dialogOptions = this.getReqCreateContractDialogOptions(selectedData);
						await this.dialogService.show(dialogOptions);
					}
				}
			} else {
				messageBoxConfig.bodyText = this.translateService.instant('procurement.requisition.contract.disableCreateContract');
				await this.msgBoxService.showMsgBox(messageBoxConfig);
			}
		}
	}

	private getReqCreateContractDialogOptions(reqHeader: IReqHeaderEntity) {
		const buttonConfig = this.createContractWizardHelperService.getCreateContractButtonConfig();
		const dialogOptions: ICustomDialogOptions<StandardDialogButtonId, ProcurementCommonCreateContractDialogComponent> = {
			bodyComponent: ProcurementCommonCreateContractDialogComponent,
			headerText: 'procurement.package.wizard.contract.header',
			buttons: buttonConfig,
			bodyProviders: [
				{
					provide: CREATE_CONTRACT_WIZARD_OPTIONS_TOKEN,
					useValue: {
						mode: ProcurementCreateContractMode.Req,
						reqHeader: reqHeader,
						//TODO Variants
					},
				},
			],
		};
		return dialogOptions;
	}
}
