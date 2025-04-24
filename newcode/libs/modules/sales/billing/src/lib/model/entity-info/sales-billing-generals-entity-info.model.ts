/*
 * Copyright(c) RIB Software GmbH
 */

import { SalesBillingGeneralsDataService } from '../../services/sales-billing-generals-data.service';
import { SalesSharedEntityInfo } from '@libs/sales/shared';

export const SALES_BILLING_GENERALS_ENTITY_INFO =
new SalesSharedEntityInfo().getGeneralEntityInfo
(
	'a24b8036afc1413fbdaa16e9edc73447', 
	'024a6871ea284639b80307eef7af32be',
	'GeneralsDto',
	'Sales.Billing',
	SalesBillingGeneralsDataService
);


