/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext, IWizard } from '@libs/platform/common';

export const SALES_BID_WIZARDS: IWizard[] = [
    {
        uuid: '30cccc5ae6f34808aac013b72cd1d361',
        name: 'changeBidStatus',
        execute(context: IInitializationContext) {
            return import('@libs/sales/bid').then((m) => {
                context.injector.get(m.SalesBidChangeBidStatusWizardService).onStartChangeStatusWizard();
            });
        },
    },
    {
        uuid: 'b1bfa908348341cbbd74c73879e0d484',
        name: 'changeCode',
        execute(context: IInitializationContext) {
            return import('@libs/sales/bid').then((m) => {
                context.injector.get(m.SalesBidChangeCodeWizardService).changeCode();
            });
        },
    }
];