/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonDocumentEntityInfo } from '@libs/procurement/common';
import { ProcurementQuoteRfqDocumentDataService } from '../../services/procurement-quote-rfq-document-data.service';



export const PROCUREMENT_QUOTE_RFQ_DOCUMENT_ENTITY_INFO = ProcurementCommonDocumentEntityInfo.create({
	permissionUuid: '38ef808fc2e1439cb90150815fba05fd',
	formUuid: 'b902c7c4766b4a4bb9aa864834602743',
	dataServiceToken: ProcurementQuoteRfqDocumentDataService,
	gridTitle: 'RFQ Document',
	gridTitleKey: 'procurement.quote.rfqDocument.prcDocumentContainerGridTitle',
	formTitle: 'RFQ Document Detail',
	formTitleKey: 'procurement.quote.rfqDocument.prcDocumentContainerFormTitle',
});