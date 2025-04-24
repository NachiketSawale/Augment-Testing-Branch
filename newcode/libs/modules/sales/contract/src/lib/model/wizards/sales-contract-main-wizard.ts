/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { SalesContractChangeAdvanceLineStatusWizardService } from '../../wizards/sales-contract-change-advance-line-status.service';
import { SalesContractChangeCodeWizardService } from '../../wizards/sales-contract-change-code-wizard.service';
import { SalesContractChangeConfigurationWizardService } from '../../wizards/sales-contract-change-configuration-wizard.service';
import { SalesContractChangeContractStatusWizardService } from '../../wizards/sales-contract-change-contract-status.service';
import { SalesContractChangePaymentScheduleStatusWizardService } from '../../wizards/sales-contract-change-payment-schedule-status.service';
import { SalesContractCreateWipWizardService } from '../../wizards/sales-contract-create-wip-wizard.service';
import { SalesContractGenerateAdvancePaymentBillWizardService } from '../../wizards/sales-contract-generate-advance-payment-bill-wizard.service';
import { SalesContractGenerateBillFromPaymentScheduleWizardService } from '../../wizards/sales-contract-generate-bill-from-payment-schedule.service';
import { SalesContractGeneratePaymentScheduleFromScheduleWizardService } from '../../wizards/sales-contract-generate-payment-schedule-from-schedule.service';
import { SalesContractGeneratePaymentScheduleWizardService } from '../../wizards/sales-contract-generate-payment-schedule.service';
import { SalesContractGenerateTransactionsWizardService } from '../../wizards/sales-contract-generate-transactions.service';
import { SalesContractMaintainPaymentScheduleVersionWizardService } from '../../wizards/sales-contract-maintain-payment-schedule-version.service';
import { SalesContractUpdateEstimateWizardService } from '../../wizards/sales-contract-update-estimate-wizard.service';
import { SalesContractUpdatePaymentScheduleDocService } from '../../wizards/sales-contract-update-payment-schedule-doc.service';
import { SalesContractWizardService } from '../../wizards/sales-contract-wizard.service';



export class SalesContractMainWizard {
	public createBill(context: IInitializationContext) {
		const service = context.injector.get(SalesContractWizardService);
		service.createBill();
	}

	public createWip(context: IInitializationContext) {
		const service = context.injector.get(SalesContractCreateWipWizardService);
		service.createWip();
	}

    public updatEstimate(context: IInitializationContext) {
        const service = context.injector.get(SalesContractUpdateEstimateWizardService);
        service.updatEstimate();
    }

	public changeContractStatus(context: IInitializationContext) {
		const service = context.injector.get(SalesContractChangeContractStatusWizardService);
		service.changeContractStatus();
	}

	public changeContractCode(context: IInitializationContext) {
		const service = context.injector.get(SalesContractChangeCodeWizardService);
		service.changeContractCode();
	}

	public changeAdvanceLineStatus(context: IInitializationContext) {
		const service = context.injector.get(SalesContractChangeAdvanceLineStatusWizardService);
		service.changeAdvanceLineStatus();
	}

	public generateAdvancePaymentBill(context: IInitializationContext) {
		const service = context.injector.get(SalesContractGenerateAdvancePaymentBillWizardService);
		service.generateAdvancePaymentBill();
	}

	public generatePaymentSchedule(context: IInitializationContext) {
		const service = context.injector.get(SalesContractGeneratePaymentScheduleWizardService);
		service.generatePaymentSchedule();
	}

	public changePaymentScheduleStatus(context: IInitializationContext) {
		const service = context.injector.get(SalesContractChangePaymentScheduleStatusWizardService);
		service.changePaymentScheduleStatus();
	}
	public changeContractConfiguration(context: IInitializationContext) {
		const service = context.injector.get(SalesContractChangeConfigurationWizardService);
		service.changeContractConfiguration();
	}

	public generateBillFromPaymentSchedule(context: IInitializationContext) {
		const service = context.injector.get(SalesContractGenerateBillFromPaymentScheduleWizardService);
		service.generateBillFromPaymentSchedule();
	}

	public generateTransactionsForOrders(context: IInitializationContext) {
		const service = context.injector.get(SalesContractGenerateTransactionsWizardService);
		service.generateTransaction();
	}
	public generatePaymentScheduleFromSchedule(context: IInitializationContext) {
		const service = context.injector.get(SalesContractGeneratePaymentScheduleFromScheduleWizardService);
		service.generatePaymentScheduleFromSchedule();
	}
	public updatePaymentScheduleDoc(context: IInitializationContext) {
		const service = context.injector.get(SalesContractUpdatePaymentScheduleDocService);
		service.updatePaymentScheduleDoc();
	}

	public maintainPaymentScheduleVersion(context: IInitializationContext) {
		const service = context.injector.get(SalesContractMaintainPaymentScheduleVersionWizardService);
		service.maintainPaymentScheduleVersion();
	}
}