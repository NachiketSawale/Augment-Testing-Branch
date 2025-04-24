/*
 * Copyright(c) RIB Software GmbH
 */
import { IInitializationContext } from '@libs/platform/common';
import { ControllingRevenueRecognitionCreateTransactionWizardService } from '../../services/wizards/revenue-recognition-create-transaction-wizard.service';
import { RevenueRecognitionChangeStatusWizardService } from '../../services/wizards/revenue-recognition-change-status-wizard.service';


export class ControllingRevenueRecognitionWizard {

	public static createTransactionWizard(context: IInitializationContext) {
		const service = context.injector.get(ControllingRevenueRecognitionCreateTransactionWizardService);
		service.onCreateTransactionWizard();
	}

	public static changeStatusWizard(context: IInitializationContext) {
		const service = context.injector.get(RevenueRecognitionChangeStatusWizardService);
		service.onStartChangeStatusWizard();
	}

}