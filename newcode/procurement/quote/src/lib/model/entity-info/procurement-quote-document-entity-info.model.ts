/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonDocumentEntityInfo } from '@libs/procurement/common';
import { ProcurementQuoteDocumentDataService } from '../../services/procurement-quote-document-data.service';


export const PROCUREMENT_QUOTE_DOCUMENT_ENTITY_INFO = ProcurementCommonDocumentEntityInfo.create({
	permissionUuid: 'ec2420d04c8d458490c29edbd9b9cafc',
	formUuid: '03b10c1f188f4b219b491f5696c056c6',
	dataServiceToken: ProcurementQuoteDocumentDataService,
});