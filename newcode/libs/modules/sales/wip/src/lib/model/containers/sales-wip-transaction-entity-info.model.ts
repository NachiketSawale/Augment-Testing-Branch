/*
 * Copyright(c) RIB Software GmbH
 */

import {SalesSharedEntityInfo} from '@libs/sales/shared';
import { SalesWipTransactionDataService } from '../../services/sales-wip-transaction-data.service';

export const SALES_WIP_TRANSACTION_ENTITY_INFO =
	new SalesSharedEntityInfo().getTransactionEntityInfo
	(
		'b80e1b103b79400997a02cef1dda2e1d',
		'ad89ba879ca34b058522486db2cd35aa',
		'WipTransactionDto',
		'Sales.Wip',
		SalesWipTransactionDataService
	);
