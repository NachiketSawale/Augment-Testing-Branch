/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsSharedUserFormDataEntityInfoFactory, Rubric } from '@libs/basics/shared';
import { BilHeaderComplete } from '../complete-class/bil-header-complete.class';
import { SalesBillingBillsDataService } from '../../services/sales-billing-bills-data.service';
import { IBilHeaderEntity } from '@libs/sales/interfaces';

/**
 * Sales billing Form Data Entity Info
 */
export const SALES_BILLING_FORM_DATA_ENTITY_INFO = BasicsSharedUserFormDataEntityInfoFactory.create<IBilHeaderEntity, BilHeaderComplete>({
    rubric: Rubric.Bill,
    permissionUuid: '2d5e03e10f484ba687aede096c618680',
    gridTitle: {
        key: 'basics.userform.defaultContainerTitle'
    },

    parentServiceFn: (ctx) => {
        return ctx.injector.get(SalesBillingBillsDataService);
    },
});