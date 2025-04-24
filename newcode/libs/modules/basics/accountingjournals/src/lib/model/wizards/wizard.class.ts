/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { ChangeTransactionStatusWizardService } from '../../services/wizards/change-transaction-status-wizard.service';

export class BasicsAccountingJournalsWizard{
    public changeTransactionStatus(context: IInitializationContext){
        const service = context.injector.get(ChangeTransactionStatusWizardService);
        service.startChangeStatusWizard();
    }
}