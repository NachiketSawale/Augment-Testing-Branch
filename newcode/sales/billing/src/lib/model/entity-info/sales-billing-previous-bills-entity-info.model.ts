/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IBilHeaderEntity } from '@libs/sales/interfaces';
import { SalesBillingPreviousBillsDataService } from '../../services/sales-billing-previous-bills-data.service';
import { SalesBillingPreviousBillsBehavior } from '../../behaviors/sales-billing-previous-bills-behavior.service';
import { SalesBillingPreviousBillsLayoutService } from '../../services/layout-services/sales-billing-previous-bills-layout.service';

/**
 * Sales Billing Chained Invoices (Previous Bills) Entity Info.
 */
export const SALES_BILLING_PREVIOUS_BILLS_ENTITY_INFO: EntityInfo = EntityInfo.create<IBilHeaderEntity>({
    grid: {
        title: { key: 'sales.billing.containerTitlePredecessors' },
        behavior: (ctx) => ctx.injector.get(SalesBillingPreviousBillsBehavior),
    },
    dataService: (ctx) => ctx.injector.get(SalesBillingPreviousBillsDataService),
    dtoSchemeId: { moduleSubModule: 'Sales.Billing', typeName: 'BilHeaderDto' },
    permissionUuid: 'f825fabe0d0949ea8ef3f6c6dbbdea60',
    layoutConfiguration: (context) => {
		return context.injector.get(SalesBillingPreviousBillsLayoutService).generateConfig();
	},
});
