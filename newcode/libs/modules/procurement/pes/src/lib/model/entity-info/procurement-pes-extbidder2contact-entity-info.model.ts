/*
 * Copyright(c) RIB Software GmbH
 */

import { PrcCommonExtBidder2contactEntityInfo } from '@libs/procurement/common';
import { ProcurementPesExtBidder2ContactDataService } from '../../services/procurement-pes-extbidder2contact-data.service';

export const PROCUREMENT_PES_EXTBIDDER2CONTACT_ENTITY_INFO = PrcCommonExtBidder2contactEntityInfo.create({
	permissionUuid:'5FBD673B50874A02A9A63A81FB24909A',
	formUuid:'37F6AB1748784D72B2222488EF23AB34',
	dataServiceToken:ProcurementPesExtBidder2ContactDataService,
});