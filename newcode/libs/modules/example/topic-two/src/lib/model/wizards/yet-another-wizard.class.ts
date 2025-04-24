import { IInitializationContext } from '@libs/platform/common';
// TODO: remove - this was only a test
//import { WizardCounterService } from "../../../../../common/src/lib/services/wizard-counter.service";

export class YetAnotherWizard {

	public constructor(private readonly context: IInitializationContext) {
	}

	public execute() {
		//const counterSvc = this.context.injector.get(WizardCounterService);
		//const callIdx = counterSvc.callWizard();

		//alert(`Call: ${callIdx}`);
	}
}