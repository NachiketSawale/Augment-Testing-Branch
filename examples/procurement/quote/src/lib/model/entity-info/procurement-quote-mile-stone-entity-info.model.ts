/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonMileStoneEntityInfo } from '@libs/procurement/common';
import { ProcurementQuoteMileStoneDataService } from '../../services/procurement-quote-mile-stone-data.service';

/**
 * Entity info for procurement Quote milestone
 */
export const PROCUREMENT_QUOTE_MILE_STONE_ENTITY_INFO = ProcurementCommonMileStoneEntityInfo.create({
	permissionUuid: 'A21042925BF44AE59FA2D849BBEC3818',
	formUuid: '2B60BAA2C9BA44B88B502E4671F39735',
	dataServiceToken: ProcurementQuoteMileStoneDataService,
});
