/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedHistoricalPriceForItemEntityInfo } from '@libs/basics/shared';
import { ProcurementRequisitionHistoricalPriceForItemDataService } from '../../services/procurement-requisition-historical-price-for-item-data.service';

/**
 * Entity info for procurement requisition historical price for item
 */
export const REQUISITION_HISTORICAL_PRICE_FOR_ITEM_ENTITY_INFO = BasicsSharedHistoricalPriceForItemEntityInfo.create({
	permissionUuid: 'c3b3393d74914d0facc2bd9dcb2e7aa8',
	dataServiceToken: ProcurementRequisitionHistoricalPriceForItemDataService,
});