/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { SalesBillingBillsDataService } from '../../services/sales-billing-bills-data.service';

/**
 * Entity info for sales billing characteristic 2
 */
export const SALES_BILLING_CHARACTERISTIC2_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create2({
    permissionUuid: '99e40e1bb7f047069b51797cdc824425',
    sectionId: BasicsCharacteristicSection.SalesBilling2,
    parentServiceFn: (ctx) => {
        return ctx.injector.get(SalesBillingBillsDataService);
    },
});
