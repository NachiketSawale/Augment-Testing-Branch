/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonDocumentEntityInfo } from '@libs/procurement/common';
import { ProcurementRfqDocumentDataService } from '../../services/procurement-rfq-document-data.service';


/**
 * Procurement RFQ Document entity info model
 */
export const PROCUREMENT_RFQ_DOCUMENT_ENTITY_INFO = ProcurementCommonDocumentEntityInfo.create({
	permissionUuid: '522cf3266f4b49dd8fe4e6569a5845ae',
	formUuid: '791559b40609403f9d6939babc120ebc',
	dataServiceToken: ProcurementRfqDocumentDataService,
});