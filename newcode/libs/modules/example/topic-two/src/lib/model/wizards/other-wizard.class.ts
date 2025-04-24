/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

//import { WizardHelper } from './wizard-helper.class';
import { IInitializationContext, PlatformTranslateService } from '@libs/platform/common';
//import { StatementSuffixService } from '../../services/statement-suffix.service';
// TODO: remove - this was only a test
//import { WizardCounterService } from "../../../../../common/src/lib/services/wizard-counter.service";

/**
 * This class demonstrates how to implement a wizard.
 */
export class OtherWizard {

	public constructor(private readonly context: IInitializationContext) {
	}

	public execute(translateSvc: PlatformTranslateService): void {
		console.log(translateSvc.instant({ key: 'model.administration.viewerSettingsListTitle' }).text);
		//const counterSvc = this.context.injector.get(WizardCounterService);
		//const callIdx = counterSvc.callWizard();
		/*
		const suffixSvc = this.context.injector.get(StatementSuffixService);
		const msg = suffixSvc.appendAffirmativeSuffix('All of our wizards are currently occupied. Please try again later.');
		new WizardHelper().showMessage(`${msg}\nCall ${callIdx}`);
		*/
	}
}