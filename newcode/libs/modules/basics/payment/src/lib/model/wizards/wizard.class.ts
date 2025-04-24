/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { BasicsPaymentEnableWizardService } from '../../services/basics-payment-enable-wizard.service';
import { BasicsPaymentDisableWizardService } from '../../services/basics-payment-disable-wizard.service';

export class BasicsPaymentWizard{
    public paymentEnableWizard(context: IInitializationContext){
        const service = context.injector.get(BasicsPaymentEnableWizardService);
        service.onStartEnableWizard();
    }

    public paymentDisableWizard(context: IInitializationContext){
        const service = context.injector.get(BasicsPaymentDisableWizardService);
        service.onStartDisableWizard();
    }
}