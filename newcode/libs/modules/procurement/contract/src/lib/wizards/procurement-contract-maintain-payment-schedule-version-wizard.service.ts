/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import {ProcurementContractHeaderDataService} from '../services/procurement-contract-header-data.service';
import {IConHeaderEntity} from '../model/entities';
import { ContractComplete } from '../model/contract-complete.class';
import { ProcurementCommonMaintainPaymentScheduleVersionWizardService } from '@libs/procurement/common';

@Injectable({
	providedIn: 'root'
})
export class ProcurementContractMaintainPaymentScheduleVersionWizardService extends ProcurementCommonMaintainPaymentScheduleVersionWizardService<IConHeaderEntity,ContractComplete> {
	public constructor() {
		super({
			rootDataService: inject(ProcurementContractHeaderDataService)
		});
	}

	protected override async startWizardValidate(): Promise<boolean> {
		super.startWizardValidate();
		if (this.config.rootDataService.hasSelection() && this.config.rootDataService.getSelectedEntity()!.ContractHeaderFk) {
			await this.messageBoxService.showMsgBox('procurement.common.wizard.noItemSelectedTitle', 'procurement.common.paymentSchedule.pleaseSelectMainContract', 'ico-error');
			return false;
		}
		return true;
	}
}