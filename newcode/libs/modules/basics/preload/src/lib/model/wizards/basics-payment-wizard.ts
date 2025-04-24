/*
 * Copyright(c) RIB Software GmbH
 */

import { IWizard } from '@libs/platform/common';
export const BASICS_PAYMENT_WIZARDS: IWizard[] =
    [
        {
            uuid: '3b2949f29ce243099b1fb627883367b1',
            name: 'disablePayment',
            execute: context => {
                return import('@libs/basics/payment').then((module) => new module.BasicsPaymentWizard().paymentDisableWizard(context));
            }
        },
        {
            uuid: 'c74f6004ca1c45309d6fc6ccb5e016f3',
            name: 'enablePayment',
            execute: context => {
                return import('@libs/basics/payment').then((module) => new module.BasicsPaymentWizard().paymentEnableWizard(context));
            }
        }
    ];
