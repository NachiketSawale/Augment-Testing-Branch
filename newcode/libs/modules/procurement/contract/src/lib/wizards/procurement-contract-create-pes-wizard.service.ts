/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IConHeaderEntity } from '../model/entities';
import { ContractComplete } from '../model/contract-complete.class';
import { ProcurementContractHeaderDataService } from '../services/procurement-contract-header-data.service';
import { ProcurementCommonWizardBaseService } from '@libs/procurement/common';
import { IEditorDialogResult, StandardDialogButtonId } from '@libs/ui/common';
import { DialogType, IPrcContractCreatePesOption, PesCreationDialogResult, PRC_CONTRACT_CREATE_PES_OPTIONS, ValidResult, ValidResultKeys } from '../model/interfaces/wizards/prc-contract-create-pes-wizard.interface';
import { PrcConCreatePesCoverConfirmComponent } from '../components/prc-con-create-pes-dialog/cover-confirm-page/cover-confirm-page.component';
import { PrcConCreatePartialPesComponent } from '../components/prc-con-create-pes-dialog/create-partial-pes/create-partial-pes.component';

@Injectable({
	providedIn: 'root'
})
export class ProcurementContractCreatePesWizardService extends ProcurementCommonWizardBaseService<IConHeaderEntity, ContractComplete, IPrcContractCreatePesOption> {

	private validContracts: IConHeaderEntity[] = [];

	public constructor(private readonly dataService: ProcurementContractHeaderDataService) {
		super({
			rootDataService: dataService
		});
	}

	protected override async startWizardValidate() {
		super.startWizardValidate(false);

		const headerText = 'procurement.contract.wizard.isActivateCaption';
		const selectedEntities = this.dataService.getSelection();
		// Check if any selected entity is a framework contract
		if (selectedEntities.some(entity => entity.IsFramework)) {
			await this.messageBoxService.showMsgBox('procurement.contract.frameworkContractNotSupported', headerText, 'ico-error');
			return false;
		}

		// Messages mapping
		const messages = {
			[ValidResultKeys.IsValid]: 'procurement.contract.wizard.isActiveMessage',
			[ValidResultKeys.CreatePesSkipContracts]: 'procurement.contract.wizard.createPesSkipContracts',
			[ValidResultKeys.CreatePesSkipContractsByInvalidBoq]: 'procurement.contract.wizard.createPesSkipContractsByInvalidBoq',
			[ValidResultKeys.CreatePesDefaultPrcClerkRequired]: 'procurement.contract.wizard.createPesDefaultPrcClerkRequired',
			[ValidResultKeys.MultipleBaseContractAbortCreatePes]: 'procurement.contract.wizard.multipleBaseContractAbortCreatePes'
		};

		this.wizardUtilService.showLoadingDialog('procurement.contract.wizard.createPesTitle');
		// Validate contracts status
		const result = await this.validateContractsStatus(selectedEntities);
		this.validContracts = result.ValidContracts;
		if (!result.Messages) {
			return true;
		}
		let shouldContinue = true;
		// Process and display messages
		for (const [key, messageKey] of Object.entries(messages)) {
			const keyNum = Number(key);
			const isError = keyNum === ValidResultKeys.IsValid || ValidResultKeys.MultipleBaseContractAbortCreatePes;
			const invalidContracts = result.Messages.find(dict => keyNum in dict);
			if (invalidContracts) {
				this.wizardUtilService.closeLoadingDialog();
				const bodyText = this.translateService.instant(messageKey, {contracts: invalidContracts[keyNum]}).text;
				const iconType = isError ? 'ico-error' : 'ico-info';
				await this.messageBoxService.showMsgBox(bodyText, headerText, iconType);
				if (isError) {
					shouldContinue = false;
				}
			}
		}

		return shouldContinue;
	}

	protected override async showWizardDialog(): Promise<IEditorDialogResult<IPrcContractCreatePesOption> | undefined> {
		const pesCreationDialogResult = await this.createPes4ContractPrepareCreation(this.validContracts);
		this.wizardUtilService.closeLoadingDialog();
		if (pesCreationDialogResult.length === 0) {
			return undefined;
		}
		for (const pesCreation of pesCreationDialogResult) {
			switch (pesCreation.DialogType) {
				case DialogType.ShowCoverConfirmDialog:
					await this.showCoverConfirmDialog(pesCreation, true);
					break;
				case DialogType.ShowNonContractedItems:
					await this.showCoverConfirmDialog(pesCreation, false);
					break;
				case DialogType.ShowOptionDialog:
					await this.showOptionDialog(pesCreation);
					break;
				case DialogType.CreateCompletely:
					//todo Completed on :DEV-20466
					break;
			}
		}

		return undefined;
	}

	protected override async onFinishWizard(opt: IPrcContractCreatePesOption): Promise<void> {
		//todo Completed on :DEV-20466
	}

	private showCoverConfirmDialog(pesCreation: PesCreationDialogResult, showIncluded: boolean) {
		const headerText = this.translateService.instant('procurement.contract.wizard.createPesByCurrentContract', {contracts: pesCreation.ContractCode}).text;
		return this.dialogService.show({
			width: '400px',
			headerText: headerText,
			resizeable: true,
			showCloseButton: true,
			bodyComponent: PrcConCreatePesCoverConfirmComponent,
			bodyProviders: [{
				provide: PRC_CONTRACT_CREATE_PES_OPTIONS, useValue: {
					mainItemId: pesCreation.ContractId,
					showIncluded: showIncluded,
					isIncluded: showIncluded,
				}
			}],
			buttons: [
				{
					id: StandardDialogButtonId.Yes,
					caption: {key: 'ui.common.dialog.yesBtn'},
					fn(evt, info) {
						info.dialog.body.onYesBtnClicked();
						return undefined;
					},
					isVisible: showIncluded
				},
				{
					id: StandardDialogButtonId.No,
					caption: {key: 'ui.common.dialog.noBtn'},
					isVisible: showIncluded
				},
				{
					id: 'include',
					caption: {key: 'procurement.contract.wizard.include'},
					fn(evt, info) {
						info.dialog.body.updateDialogWrapper(true);
						return undefined;
					},
					isVisible: !showIncluded
				},
				{
					id: StandardDialogButtonId.Ignore,
					caption: {key: 'ui.common.dialog.ignoreBtn'},
					fn(evt, info) {
						info.dialog.body.updateDialogWrapper(false);
						return undefined;
					},
					isVisible: !showIncluded
				}
			]
		});
	}

	private showOptionDialog(pesCreation: PesCreationDialogResult) {
		const headerText = this.translateService.instant('procurement.contract.wizard.createPesByCurrentContract', {contracts: pesCreation.ContractCode}).text;
		return this.dialogService.show({
			width: '800px',
			headerText: headerText,
			resizeable: true,
			showCloseButton: true,
			bodyComponent: PrcConCreatePartialPesComponent,
			bodyProviders: [{
				provide: PRC_CONTRACT_CREATE_PES_OPTIONS, useValue: {
					mainItemId: pesCreation.ContractId,
					pesHeaders: pesCreation.PesHeaders,
					boqPrcItems: pesCreation.BoqPrcItems,
					isConsolidateChange: pesCreation.IsConsolidateChange,
				}
			}],
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					caption: {key: 'ui.common.dialog.okBtn'},
					fn(evt, info) {
						info.dialog.body.ok();
						return undefined;
					},
				},
				{
					id: StandardDialogButtonId.Cancel,
					caption: {key: 'ui.common.dialog.cancelBtn'},
				}
			]
		});
	}

	private async validateContractsStatus(entities: IConHeaderEntity[]) {
		return await this.http.post<ValidResult>('procurement/contract/header/validatecontracts2createpes', entities);
	}

	private async createPes4ContractPrepareCreation(entities: IConHeaderEntity[]) {
		return await this.http.post<PesCreationDialogResult[]>('procurement/pes/wizard/createpes4contractpreparecreation', entities);
	}
}