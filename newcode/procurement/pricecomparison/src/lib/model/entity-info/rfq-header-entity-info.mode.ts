/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementRfqHeaderEntityInfoFactory } from '@libs/procurement/rfq';
import { ProcurementPricecomparisonRfqHeaderDataService } from '../../services/rfq-header-data.service';
import { ProcurementPricecomparisonRfqHeaderGridBehavior } from '../../behaviors/rfq-header-behavior.service';

export const RFQ_HEADER_ENTITY_INFO = ProcurementRfqHeaderEntityInfoFactory.create({
	dataService: (ctx) => ctx.injector.get(ProcurementPricecomparisonRfqHeaderDataService),
	behavior: ctx => ctx.injector.get(ProcurementPricecomparisonRfqHeaderGridBehavior),
	permissionUuid: '1ec440875e364e8684f0ad25f0d94510',
	formContainerUuid: 'f9b0a5b7e1724150abc418ea83b507db',
});