/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonExtBidderEntityInfo } from '@libs/procurement/common';
import { ProcurementQuoteExtBidderDataService } from '../../services/procurement-quote-extbidder-data.service';

/**
 * The entity info for the procurement quote futher extranal BPs container.
 */
export const PROCUREMENT_QUOTE_EXT_BIDDER_ENTITY_INFO = ProcurementCommonExtBidderEntityInfo.create({
	permissionUuid:'de4193fe7caf4aa1bd69c0fcaac8041d',
	formUuid:'add02bd879f64767acca25214e5ff941',
	dataServiceToken:ProcurementQuoteExtBidderDataService,
});