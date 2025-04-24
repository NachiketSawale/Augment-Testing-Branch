/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonExtBidderEntityInfo } from '@libs/procurement/common';
import { ProcurementPesExtBidderDataService } from '../../services/procurement-pes-extbidder-data.service';

export const PROCUREMENT_PES_EXT_BIDDER_ENTITY_INFO = ProcurementCommonExtBidderEntityInfo.create({
	permissionUuid:'de4193fe7caf4aa1bd69c0fcaac8041d',
	formUuid:'00d26a0eb552403891a281a37895a5ae',
	dataServiceToken:ProcurementPesExtBidderDataService,
});