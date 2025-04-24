/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { LogisticSundryGroupDisableWizardService } from '../../services/wizards/logistic-sundry-service-group-disable-wizard.service';
import { LogisticSundryGroupEnableWizardService } from '../../services/wizards/logistic-sundry-service-group-enable-wizard.service';

export class LogisticSundryGroupWizard{
	public sundryGroupEnableWizard(context: IInitializationContext){
		const service = context.injector.get(LogisticSundryGroupEnableWizardService);
		service.onStartEnableWizard();
	}

	public sundryGroupDisableWizard(context: IInitializationContext){
		const service = context.injector.get(LogisticSundryGroupDisableWizardService);
		service.onStartDisableWizard();
	}
}