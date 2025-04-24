/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IPesHeaderEntity } from '../model/entities';
import { ProcurementCommonWizardBaseService, ProcurementContractPurchaseOrderTypeService } from '@libs/procurement/common';
import { PesCompleteNew } from '../model/complete-class/pes-complete-new.class';
import { ProcurementPesHeaderDataService } from '../services/procurement-pes-header-data.service';
import { IEditorDialogResult, StandardDialogButtonId } from '@libs/ui/common';

import { ProcurementPesCreateChangeOrderWizardComponent } from '../components/procurement-pes-create-change-order-wizard/procurement-pes-create-change-order-wizard.component';
import { IPESCreateChangeOrderInitData, PES_CREATE_CHANGE_ORDER_PARAM } from '../model/interfaces/wizard/pes-create-change-order.interface';
import { IPrcConHeaderEntity } from '@libs/procurement/interfaces';
import { ProcurementInternalModule } from '@libs/procurement/shared';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPesCreateChangeOrderWizardService extends ProcurementCommonWizardBaseService<IPesHeaderEntity, PesCompleteNew, IPrcConHeaderEntity[]> {
	private wizardInitialData?: IPESCreateChangeOrderInitData;
	private readonly wizardTitle = 'procurement.pes.createCOContractWizard.dialogTitle';

	public constructor() {
		super({
			rootDataService: inject(ProcurementPesHeaderDataService),
		});
	}

	protected override async startWizardValidate() {
		if (!(await super.startWizardValidate(false))) {
			return false;
		}

		const pes = this.config.rootDataService.getSelectedEntity();

		this.wizardInitialData = await this.http.get<IPESCreateChangeOrderInitData>('procurement/pes/wizard/getchangeordercontracts', {
			params: {
				pesHeaderId: pes!.Id,
			},
		});

		if (!this.wizardInitialData?.changeHeader) {
			await this.messageBoxService.showMsgBox('procurement.pes.createCOContractWizard.noNewItemsFound', this.wizardTitle, 'ico-info');
			return false;
		}

		this.wizardInitialData.isLinkFrameworkContract = this.isLinkFrameworkContract();

		return true;
	}

	protected override async showWizardDialog(): Promise<IEditorDialogResult<IPrcConHeaderEntity[]> | undefined> {
		return this.dialogService.show({
			width: '800px',
			headerText: 'procurement.pes.createCOContractWizard.dialogTitleForFWContract',
			resizeable: true,
			id: 'procurement.pes.createCOContractWizard',
			showCloseButton: true,
			bodyComponent: ProcurementPesCreateChangeOrderWizardComponent,
			bodyProviders: [
				{
					provide: PES_CREATE_CHANGE_ORDER_PARAM,
					useValue: this.wizardInitialData,
				},
			],
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					caption: {key: 'ui.common.dialog.okBtn'},
					fn(evt, info) {
						info.dialog.body.okBtnClicked();
					},
					isDisabled: (info) => {
						return info.dialog.body.okBtnDisabled();
					},
					autoClose: true,
				},
				{id: StandardDialogButtonId.Cancel, caption: {key: 'ui.common.dialog.cancelBtn'}},
			],
		});
	}

	private isLinkFrameworkContract(): boolean {
		const entity = this.wizardInitialData!.contract;
		return ProcurementContractPurchaseOrderTypeService.isFrameworkByWicNMdcCatalog(entity);
	}

	protected override async doExecuteWizard(contractList?: IPrcConHeaderEntity[], bntId: StandardDialogButtonId | string = StandardDialogButtonId.Ok): Promise<boolean> {
		if (contractList) {
			this.wizardUtilService.showLoadingDialog(this.wizardTitle);
			let createResult: IPrcConHeaderEntity[] = [];
			try {
				const pes = this.config.rootDataService.getSelectedEntity();

				if (this.isLinkFrameworkContract()) {
					createResult = await this.http.post<IPrcConHeaderEntity[]>('procurement/pes/wizard/createframeworkcontracts', {
						PesHeaderId: pes!.Id,
						FrameworkContracts: contractList,
					});
				} else {
					createResult = await this.http.post<IPrcConHeaderEntity[]>('procurement/pes/wizard/createchangeordercontracts', {
						PesHeaderId: pes!.Id,
						ChangeOrderContracts: contractList,
					});
				}
			} finally {
				this.wizardUtilService.closeLoadingDialog();
			}

			if (createResult.length) {
				const successMsg =
					this.translateService.instant('procurement.pes.createCOContractWizard.createCOContractsSuccessfully').text +
					'  ' +
					this.translateService.instant('procurement.pes.wizard.newCode', {
						newCode: createResult.map((contract) => contract.Code).join(','),
					}).text;

				await this.wizardUtilService.showGoToMsgBox(
					successMsg,
					this.wizardTitle,
					createResult.map((contract) => {
						return {pKey1: contract.Id, id: contract.Id};
					}),
					ProcurementInternalModule.Contract,
				);

				return true;
			}
		}
		return false;
	}
}
