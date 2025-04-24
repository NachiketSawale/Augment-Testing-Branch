/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { BasicsSiteEnableWizardService } from '../../../services/wizards/basics-site-enable-wizard.service';
import { BasicsSiteDisableWizardService } from '../../../services/wizards/basics-site-disable-wizard.service';

export class BasicsSiteWizard {
    
    public enableSite(context: IInitializationContext) {
        const service = context.injector.get(BasicsSiteEnableWizardService);
        service.onStartEnableWizard();
    }
    public disbleSite(context: IInitializationContext) {
        const service = context.injector.get(BasicsSiteDisableWizardService);
        service.onStartDisableWizard();
    }

}