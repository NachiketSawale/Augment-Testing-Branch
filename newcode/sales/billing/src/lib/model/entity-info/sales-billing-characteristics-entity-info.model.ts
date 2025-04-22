/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { SalesBillingBillsDataService } from '../../services/sales-billing-bills-data.service';
/**
 * Entity info for sales billing characteristics
 */
export const SALES_BILLING_CHARACTERISTICS_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create({
    permissionUuid: '39608924dc884afea59fe04cb1434543',
    containerUuid: '1614ed65978741289965a4595a2becbd',
    sectionId: BasicsCharacteristicSection.SalesBilling,
    parentServiceFn: (ctx) => {
        return ctx.injector.get(SalesBillingBillsDataService);
    },
});
