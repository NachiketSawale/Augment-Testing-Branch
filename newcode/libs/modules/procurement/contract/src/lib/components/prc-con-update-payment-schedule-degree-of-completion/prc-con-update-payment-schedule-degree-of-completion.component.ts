/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlatformCommonModule } from '@libs/platform/common';
import { ProcurementContractHeaderDataService } from '../../services/procurement-contract-header-data.service';
import { ProcurementContractPaymentScheduleDataService } from '../../services/procurement-contract-payment-schedule-data.service';
import { getCustomDialogDataToken, StandardDialogButtonId } from '@libs/ui/common';

export interface IPaymentScheduleDoc {
	updateType: number;
}

export enum UpdatePaymentScheduleDocType {
	Current,
	ListAll,
}

@Component({
	selector: 'procurement-contract-update-payment-schedule-degree-of-completion',
	templateUrl: 'prc-con-update-payment-schedule-degree-of-completion.component.html',
	styleUrl: 'prc-con-update-payment-schedule-degree-of-completion.component.scss',
	standalone: true,
	imports: [FormsModule, PlatformCommonModule],
})
export class PrcConUpdatePaymentScheduleDegreeOfCompletionComponent implements OnInit {
	public readonly headerDataService = inject(ProcurementContractHeaderDataService);
	public readonly paymentScheduleService = inject(ProcurementContractPaymentScheduleDataService);
	public updateType: UpdatePaymentScheduleDocType = UpdatePaymentScheduleDocType.ListAll;
	public readonly UpdatePaymentScheduleDocType = UpdatePaymentScheduleDocType;
	public isUpdateTypeReadonly: boolean = false;
	private readonly dialogWrapper = inject(getCustomDialogDataToken<IPaymentScheduleDoc, PrcConUpdatePaymentScheduleDegreeOfCompletionComponent>());

	public ngOnInit() {
		const paymentScheduleEntity = this.paymentScheduleService.getSelectedEntity();
		if (paymentScheduleEntity) {
			this.updateType = UpdatePaymentScheduleDocType.Current;
			this.isUpdateTypeReadonly = false;
		} else {
			this.isUpdateTypeReadonly = true;
		}
	}

	public onOKBtnClicked() {
		this.dialogWrapper.value = {
			updateType: this.updateType,
		};
		this.dialogWrapper.close(StandardDialogButtonId.Ok);
	}
}
