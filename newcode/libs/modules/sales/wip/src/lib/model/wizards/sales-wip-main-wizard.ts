/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { SalesWipChangeWipStatusService } from '../../services/wizards/sales-wip-change-wip-status.service';
import { SalesWipCreateBillService } from '../../services/wizards/sales-wip-create-bill.service';
import { SalesWipChangeCodeWizardService } from '../../services/wizards/sales-wip-change-code-wizard.service';
import { SalesWipUpdateWipQuantitiesWizardService } from '../../services/wizards/sales-wip-update-wip-quantities-wizard.service';
import { SalesWipCreateAccrualsWizardService } from '../../services/wizards/sales-wip-create-accruals-wizard.service';
import { SalesWipChangeTypeOrConfigWizardService } from '../../services/wizards/sales-wip-change-type-or-config-wizard.service';
import { SalesWipSetPreviousWipWizardService } from '../../services/wizards/sales-wip-set-previous-wip-wizard.service';


export class SalesWipMainWizard {

	public changeWipStatus(context: IInitializationContext) {
		const service = context.injector.get(SalesWipChangeWipStatusService);
		service.changeWipStatus();
	}
	public createBill(context: IInitializationContext) {
		const service = context.injector.get(SalesWipCreateBillService);
		service.createBill();
	}
	public changeCode(context: IInitializationContext) {
		const service = context.injector.get(SalesWipChangeCodeWizardService);
		service.changeWipCode();
	}
	public updateWipQuantity(context: IInitializationContext) {
		const service = context.injector.get(SalesWipUpdateWipQuantitiesWizardService);
		service.updateWipQuantities();
	}
	public createWipAccruals(context: IInitializationContext) {
		const service = context.injector.get(SalesWipCreateAccrualsWizardService);   service.createWipAccruals();
	}
	public changeTypeOrConfig(context: IInitializationContext) {
		const service = context.injector.get(SalesWipChangeTypeOrConfigWizardService);
		service.changeTypeOrConfig();
	}
	public setPreviousWip(context: IInitializationContext) {
		const service = context.injector.get(SalesWipSetPreviousWipWizardService);
		service.setPreviousWip();
	}
}