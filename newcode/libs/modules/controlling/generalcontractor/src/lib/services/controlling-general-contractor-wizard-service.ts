/*
 * Copyright(c) RIB Software GmbH
 */
import {IInitializationContext} from '@libs/platform/common';
import {
    ControllingGeneralContractorCostControlWizardDialogService
} from '../wizards/controlling-general-contractor-cost-control-wizard-dialog-service';
import {
    ControllingGeneralContractorCreatePackagesWizardDialogService
} from '../wizards/controlling-general-contractor-create-packages-wizard-dialog-service';
import {
    ControllingGeneralContractorCreateAdditionalExpenseWizardDialogService
} from '../wizards/controlling-general-contractor-create-additional-expense-wizard-dialog.service';
import { GeneralContractorCreateBudgetShiftDialogService } from '../wizards/controlling-general-contractor-create-budget-shift-dialog.service';


export class ControllingGeneralContractorContractorWizardService {
    public static onStartCreateUpdateCostControlStructureWizard(context: IInitializationContext): void {
        context.injector.get(ControllingGeneralContractorCostControlWizardDialogService).onStartWizard();
    }
}

export class ControllingGeneralCreatePackagesWizardService {
    public static onStartCreatePackagesWizard(context: IInitializationContext): void {
        context.injector.get(ControllingGeneralContractorCreatePackagesWizardDialogService).onStartWizard();
    }
}

export class ControllingGeneralCreateAdditionalExpenseWizardService{
    public static onStartCreateAdditionalExpenseWizard(context: IInitializationContext): void{
        context.injector.get(ControllingGeneralContractorCreateAdditionalExpenseWizardDialogService).onStartWizard();
    }
}

export class ControllingGeneralCreateBudgetShiftWizardService {
	public static onStartCreateBudgetShiftWizard(context: IInitializationContext): void {
		 context.injector.get(GeneralContractorCreateBudgetShiftDialogService).onStartWizard();
	}
}