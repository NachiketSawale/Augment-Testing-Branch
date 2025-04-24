/*
 * Copyright(c) RIB Software GmbH
 */

import { IWizard } from '@libs/platform/common';

export const BASICS_ACCOUNTINGJOURNALS_WIZARDS: IWizard[] =
    [
        {
            uuid: 'ee7eab4169ed4ee9b2cd547d3852c649',
            name: 'changeTransactionStatus',
            execute: context => {
                return import('@libs/basics/accountingjournals').then((module) => new module.BasicsAccountingJournalsWizard().changeTransactionStatus(context));
            }
        }
    ];
