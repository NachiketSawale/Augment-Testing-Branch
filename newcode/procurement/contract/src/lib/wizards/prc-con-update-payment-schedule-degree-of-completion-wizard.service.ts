/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonWizardBaseService } from '@libs/procurement/common';
import { IConHeaderEntity } from '../model/entities';
import { ContractComplete } from '../model/contract-complete.class';
import {
	IPaymentScheduleDoc,
	PrcConUpdatePaymentScheduleDegreeOfCompletionComponent,
	UpdatePaymentScheduleDocType
} from '../components/prc-con-update-payment-schedule-degree-of-completion/prc-con-update-payment-schedule-degree-of-completion.component';
import { inject, Injectable } from '@angular/core';
import { ProcurementContractHeaderDataService } from '../services/procurement-contract-header-data.service';
import { IEditorDialogResult, StandardDialogButtonId } from '@libs/ui/common';
import { ProcurementContractPaymentScheduleDataService } from '../services/procurement-contract-payment-schedule-data.service';

@Injectable({
	providedIn: 'root'
})

export class ContractUpdatePaymentScheduleDegreeOfCompletionWizardService extends ProcurementCommonWizardBaseService<IConHeaderEntity, ContractComplete, IPaymentScheduleDoc> {
	private readonly conHeader = this.config.rootDataService.getSelectedEntity();
	public constructor(protected paymentScheduleService:ProcurementContractPaymentScheduleDataService) {
		super({
			rootDataService: inject(ProcurementContractHeaderDataService),
		});
	}

	protected override async showWizardDialog(): Promise<IEditorDialogResult<IPaymentScheduleDoc> | undefined> {
		if (this.conHeader) {
			return this.dialogService.show({
				width: '360px',
				height: 'auto',
				headerText: 'procurement.common.wizard.updatePaymetScheduleDOC.caption',
				resizeable: true,
				id: 'c0ce3e30b54e429b9995f8ecdf94f654',
				showCloseButton: true,
				bodyComponent: PrcConUpdatePaymentScheduleDegreeOfCompletionComponent,
				buttons: [
					{
						id: StandardDialogButtonId.Ok, caption: {key: 'ui.common.dialog.okBtn'},
						fn(evt, info) {
							info.dialog.body.onOKBtnClicked();
							return undefined;
						},
					},
					{id: StandardDialogButtonId.Cancel, caption: {key: 'ui.common.dialog.cancelBtn'}},
				]
			});
		}else {
			return undefined;
		}
	}

	protected override async onFinishWizard(opt: IPaymentScheduleDoc, btnId: StandardDialogButtonId | string): Promise<void> {
		if (btnId === StandardDialogButtonId.Ok) {

			const updateUrl = 'procurement/common/prcpaymentschedule/updatepaymentscheduledegreeofcompletion';
			const prcHeaderFk = this.conHeader!.PrcHeaderFk;
			const params: { PrcHeaderFk: number; PaymentScheduleId?: number } = {PrcHeaderFk: prcHeaderFk};
			if (opt.updateType === UpdatePaymentScheduleDocType.Current) {
				const paymentScheduleEntity = this.paymentScheduleService.getSelectedEntity();
				params.PaymentScheduleId = paymentScheduleEntity?.Id;
			}

			await this.http.post(updateUrl, params);
		}
	}

	protected override async doExecuteWizard(opt: IPaymentScheduleDoc, btnId: StandardDialogButtonId | string): Promise<boolean> {
		return btnId === StandardDialogButtonId.Ok;
	}
}
