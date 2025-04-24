import { IInitializationContext } from '@libs/platform/common';
import {
	ProductionPlanningFabricationUnitEnableWizardService
} from '../services/wizards/pps-fabricationunit-enable-wizard.service';
import {
	ProductionPlanningFabricationUnitDisableWizardService
} from '../services/wizards/pps-fabricationunit-disable-wizard.service';


export class PpsFabricationunitWizard {

	public fabricationunitEnableWizard(context: IInitializationContext) {
		const service = context.injector.get(ProductionPlanningFabricationUnitEnableWizardService);
		service.onStartEnableWizard();
	}

	public fabricationunitDisableWizard(context: IInitializationContext) {
		const service = context.injector.get(ProductionPlanningFabricationUnitDisableWizardService);
		service.onStartDisableWizard();
	}
}