import { IInitializationContext } from '@libs/platform/common';
import { PpsProductTemplateEnableWizardService } from '../services/wizards/pps-product-template-enable-wizard.service';
import { PpsProductTemplateDisableWizardService } from '../services/wizards/pps-product-template-disable-wizard.service';


export class PpsProductTemlateWizardClass {

	public PpsProductTemplateEnableWizard(context: IInitializationContext) {
		const service = context.injector.get(PpsProductTemplateEnableWizardService);
		service.onStartEnableWizard();
	}

	public PpsProductTemplateDisableWizard(context: IInitializationContext) {
		const service = context.injector.get(PpsProductTemplateDisableWizardService);
		service.onStartDisableWizard();
	}
}