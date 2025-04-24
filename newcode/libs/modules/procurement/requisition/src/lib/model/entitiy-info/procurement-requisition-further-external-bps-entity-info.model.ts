/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonExtBidderEntityInfo } from '@libs/procurement/common';
import { ProcurementRequisitionExtBidderDataService } from '../../services/procurement-requisition-further-external-bps-data.service';

/**
 * The entity info for the procurement requisition further extranal BPs container.
 */
export const PROCUREMENT_REQUISITION_EXT_BIDDER_ENTITY_INFO = ProcurementCommonExtBidderEntityInfo.create({
	permissionUuid:'de4193fe7caf4aa1bd69c0fcaac8041d',
	formUuid:'d4295b299a3d40c7aaff8b61eb190b6f',
	dataServiceToken:ProcurementRequisitionExtBidderDataService,
});