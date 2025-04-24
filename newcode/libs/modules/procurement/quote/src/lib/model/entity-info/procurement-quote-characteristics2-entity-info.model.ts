/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { ProcurementQuoteHeaderDataService } from '../../services/quote-header-data.service';

/**
 * Entity info for procurement Quote characteristic 2
 */
export const PROCUREMENT_QUOTE_CHARACTERISTIC2_ENTITY_INFO	= BasicsSharedCharacteristicDataEntityInfoFactory.create2({
	permissionUuid: '10e44a66b2b7483e8c2115c5a02d217f',
	sectionId: BasicsCharacteristicSection.QuoteCharacteristics2,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(ProcurementQuoteHeaderDataService);
	}
});