/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsSharedHistoricalPriceForBoqEntityInfo } from '@libs/basics/shared';
import { ProcurementRequisitionHistoricalPriceForBoqDataService } from '../../services/procurement-requisition-historical-price-for-boq-data.service';

/**
 * Entity info for procurement requisition historical price for boq
 */
export const REQUISITION_HISTORICAL_PRICE_FOR_BOQ_ENTITY_INFO = BasicsSharedHistoricalPriceForBoqEntityInfo.create({
	permissionUuid: '6dc5ac5161f8404a96e80845fbf8a298',
	dataServiceToken: ProcurementRequisitionHistoricalPriceForBoqDataService,
});
