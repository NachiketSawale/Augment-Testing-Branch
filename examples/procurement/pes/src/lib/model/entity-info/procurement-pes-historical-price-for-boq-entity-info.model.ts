/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedHistoricalPriceForBoqEntityInfo } from '@libs/basics/shared';
import { ProcurementPesHistoricalPriceForBoqDataService } from '../../services/procurement-pes-historical-price-for-boq-data.service';

export const PES_HISTORICAL_PRICE_FOR_BOQ_ENTITY_INFO = BasicsSharedHistoricalPriceForBoqEntityInfo.create({
	permissionUuid: 'b4044966148342478f2dd8ae400855b6',
	dataServiceToken: ProcurementPesHistoricalPriceForBoqDataService,
});