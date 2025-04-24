/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IConHeaderEntity } from '../model/entities';
import { ContractComplete } from '../model/contract-complete.class';
import { ProcurementContractHeaderDataService } from '../services/procurement-contract-header-data.service';
import { IPrcItemEntity, ProcurementCommonWizardBaseService } from '@libs/procurement/common';
import { IEditorDialogResult, StandardDialogButtonId } from '@libs/ui/common';
import {
	CONTRACT_TERMINATE_DIALOG_OPTIONS,
	IContractTerminateItem,
	IContractTerminateDialogResult,
	ProcurementContractTerminateDialogComponent, CreateTerminateContractAs
} from '../components/procurement-contract-terminate-dialog/procurement-contract-terminate-dialog.component';
import { IBoqItemEntity } from '@libs/boq/interfaces';
import { ProcurementInternalModule } from '@libs/procurement/shared';


interface IContractDeliveredTotals {
	PrcItems: IPrcItemEntity[];
	PrcBoqs: IBoqItemEntity[];
	TotalNet: number;
	TotalGross: number;
	TotalDeliveredNet: number;
	TotalDeliveredGross: number;
}

@Injectable({
	providedIn: 'root'
})
export class ProcurementContractTerminateWizardService extends ProcurementCommonWizardBaseService<IConHeaderEntity, ContractComplete, IContractTerminateDialogResult> {

	public constructor() {
		super({
			rootDataService: inject(ProcurementContractHeaderDataService)
		});
	}

	protected override async showWizardDialog(): Promise<IEditorDialogResult<IContractTerminateDialogResult> | undefined> {
		const selHeader = this.config.rootDataService.getSelectedEntity();
		if (selHeader) {

			const resp = await this.http.get<IContractDeliveredTotals>('procurement/contract/wizard/getContractTotalAndDeliveredTotal', {
				params: {ContractId: selHeader.Id}
			});

			const items = resp.PrcItems.map((i) => {
				return {
					Id: i.Id.toString(),
					Type: this.translateService.instant('procurement.contract.contractTermination.Item').text,
					Itemno: i.Itemno.toString(),
					Reference: '',
					Quantity: i.Quantity,
					QuantityDelivered: i.QuantityDelivered,
					QuantityUnDelivered: i.Quantity - i.QuantityDelivered
				};
			});
			//Prc BoQs
			const boqs = resp.PrcBoqs.map((b) => {
				return {
					Id: b.Reference as string, //There is no ID returned from service. Maybe need to enhance it later.
					Type: this.translateService.instant('procurement.contract.contractTermination.Boq').text,
					Itemno: '',
					Reference: b.Reference as string,
					Quantity: b.Quantity,
					QuantityDelivered: b['QuantityDelivered'] as number,
					QuantityUnDelivered: b.Quantity - (b['QuantityDelivered'] as number)
				};
			});

			const contractTerminateItems: IContractTerminateItem[] = [...items, ...boqs].filter(i => i.QuantityUnDelivered > 0);
			//If all items are delivered, do nothing for the wizard
			if (contractTerminateItems.length === 0) {
				await this.messageBoxService.showMsgBox(
					this.translateService.instant('procurement.contract.wizard.allContractsAreDelivered').text,
					this.translateService.instant('procurement.contract.wizard.contractTermination').text,
					'ico-info');

				return;
			}

			return this.dialogService.show({
				width: '360px',
				height: 'auto',
				headerText: 'procurement.contract.wizard.contractTermination',
				resizeable: true,
				id: '00ee6a2d1c9f44ee992c8cac6ed8dcc1',
				showCloseButton: true,
				bodyComponent: ProcurementContractTerminateDialogComponent,
				bodyProviders: [{
					provide: CONTRACT_TERMINATE_DIALOG_OPTIONS, useValue: {
						selectedContract: selHeader,
						contractTerminateItems: contractTerminateItems,
						TotalNet: resp.TotalNet,
						TotalGross: resp.TotalGross,
						TotalDeliveredNet: resp.TotalDeliveredNet,
						TotalDeliveredGross: resp.TotalDeliveredGross
					}
				}],
				buttons: [
					{
						id: StandardDialogButtonId.Ok, caption: {key: 'ui.common.dialog.okBtn'},
						fn(evt, info) {
							info.dialog.body.onOKBntClicked();
							return undefined;
						},
						isDisabled: info => info.dialog.body.okBtnDisabled()
					},
					{id: StandardDialogButtonId.Cancel, caption: {key: 'ui.common.dialog.cancelBtn'}},
				]
			});
		}

		return undefined;
	}

	protected override async onFinishWizard(opt: IContractTerminateDialogResult): Promise<void> {

		let successBodyTextKey = 'procurement.contract.wizard.conTerminationCreateConSuccessfully';
		let internalModuleName = ProcurementInternalModule.Contract;

		if (opt.createAsType === CreateTerminateContractAs.Requisition) {
			successBodyTextKey = 'procurement.contract.wizard.conTerminationCreateReqSuccessfully';
			internalModuleName = ProcurementInternalModule.Requisition;
		}

		if (opt.isSuccess && opt.navigateIds) {

			await this.wizardUtilService.showGoToMsgBox(
				this.translateService.instant(successBodyTextKey, {p1: opt.mainContractReqCode, p2: opt.changeOrderCode}).text,
				this.translateService.instant('procurement.contract.wizard.contractTermination').text,
				opt.navigateIds.map(id => {
					return {id};
				}), internalModuleName);

		} else {
			this.messageBoxService.showMsgBox(
				this.translateService.instant('procurement.contract.contractTermination.fail').text,
				this.translateService.instant('procurement.contract.wizard.contractTermination').text,
				'ico-error');
		}

	}
}