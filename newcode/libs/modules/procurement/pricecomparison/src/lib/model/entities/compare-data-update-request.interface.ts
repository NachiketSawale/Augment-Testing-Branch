/*
 * Copyright(c) RIB Software GmbH
 */

import { IModifiedData } from './compare-data-state.interface';

export interface ICompareDataUpdateRequest {
	ModifiedData?: IModifiedData;
	ModifiedQuote?: { [key: number]: { [key: string]: unknown } };
	IdealQuoteCopiedData?: { [key: number]: Array<{ [key: string]: unknown }> };
	QuoteHeaderToSave?: Array<object>;
	QuoteHeaderNews?: Array<object>;
	PrcHeaderBlobToSave?: Array<object>;
	PrcHeaderBlobToDelete?: Array<object>;
	PrcItemToSave?: Array<object>;
	BoqItemToSave?: Array<object>;
	CharacteristicToSave?: Array<object>;
	ExchangeRateToSave?: Array<object>;
	BusinessPartnerEvaluationToSave?: Array<object>;
	BusinessPartnerEvaluationToDelete?: Array<object>;
	EvaluationDocumentToSave?: Array<object>;
	EvaluationDocumentToDelete?: Array<object>;
	BillingSchemaToSave?: Array<object>;
	BillingSchemaToDelete?: Array<object>;
	BidderCommentsToSave?: Array<object>;
	AllQuoteIds: Array<number>;
	PrcGeneralsToSave?: Array<object>;
}