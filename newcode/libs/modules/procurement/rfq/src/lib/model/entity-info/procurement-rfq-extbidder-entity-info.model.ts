/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonExtBidderEntityInfo } from '@libs/procurement/common';
import { ProcurementRfqExtBidderDataService } from '../../services/procurement-rfq-extbidder-data.service';

/*
 * Procurement Rfq ext bidder entity info
 */
export const PROCUREMENT_RFQ_EXT_BIDDER_ENTITY_INFO = ProcurementCommonExtBidderEntityInfo.create({
	permissionUuid:'de4193fe7caf4aa1bd69c0fcaac8041d',
	formUuid:'03660e18a1d84aa7931a1619b9157869',
	dataServiceToken:ProcurementRfqExtBidderDataService,
});