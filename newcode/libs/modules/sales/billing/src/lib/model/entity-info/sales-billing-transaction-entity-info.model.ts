/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { SalesBillingTransactionDataService } from '../../services/sales-billing-transaction-data.service';
import { ITransactionEntity } from '@libs/sales/interfaces';
import { SalesBillingTransactionLayoutService } from '../../services/layout-services/sales-billing-transaction-layout.service';

/**
 * Sales billing Transaction Entity Info
 */
export const SALES_BILLING_TRANSACTION_ENTITY_INFO: EntityInfo = EntityInfo.create<ITransactionEntity>({

    grid: {
        title: { key: 'sales.billing.containerTitleTransaction' },
    },
    form: {
        title: { key: 'sales.billing' + '.containerTitleTransactionDetail' },
        containerUuid: '3fe17cc5f81847e99667f903642150d8',
    },
    dataService: ctx => ctx.injector.get(SalesBillingTransactionDataService),
    dtoSchemeId: { moduleSubModule: 'Sales.Billing', typeName: 'TransactionDto' },
    permissionUuid: 'd45fb0e93b5a4101b875c66686887918',
    layoutConfiguration: (ctx) => ctx.injector.get(SalesBillingTransactionLayoutService).generateLayout(),
});