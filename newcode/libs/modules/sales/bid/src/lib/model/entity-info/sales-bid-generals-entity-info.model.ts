/*
 * Copyright(c) RIB Software GmbH
 */

import { SalesSharedEntityInfo } from '@libs/sales/shared';
import { SalesBidGeneralsDataService } from '../../services/sales-bid-generals-data.service';

/**
 * Sales Bid Generals Entity info
 */
export const SALES_BID_GENERALS_ENTITY_INFO =
new SalesSharedEntityInfo().getGeneralEntityInfo
(
	'953385da027f45f786244d350d7124fd', 
	'd440373784664e58bbb3f57e66ef9566',
	'GeneralsDto',
	'Sales.Bid',
	SalesBidGeneralsDataService
);


