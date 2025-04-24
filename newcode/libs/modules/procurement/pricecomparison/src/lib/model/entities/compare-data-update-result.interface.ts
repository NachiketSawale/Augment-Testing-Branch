/*
 * Copyright(c) RIB Software GmbH
 */

import { IQuoteHeaderEntity } from '@libs/procurement/quote';

export interface ICompareDataUpdateResult {
	ModifiedData?: { [key: number]: Array<{ [key: string]: unknown }> };
	ModifiedQuote?: { [key: number]: { [key: string]: unknown } };
	IdealQuoteCopiedData?: { [key: number]: Array<{ [key: string]: unknown }> };
	QuoteHeaderToSave?: Array<object>;
	QuoteHeaderNews?: IQuoteHeaderEntity[];
	PrcHeaderBlobToSave?: Array<object>;
	PrcHeaderBlobToDelete?: Array<object>;
	PrcItemToSave?: Array<object>;
	BoqItemToSave?: Array<object>;
	BusinessPartnerEvaluationToSave?: Array<object>;
	BusinessPartnerEvaluationToDelete?: Array<object>;
	EvaluationDocumentToSave?: Array<object>;
	EvaluationDocumentToDelete?: Array<object>;
	BillingSchemaToSave?: Array<object>;
	BillingSchemaToDelete?: Array<object>;
	CharacteristicToSave?: Array<object>;
	ExchangeRateToSave?: Array<object>;
	BillingSchemaTypeList?: Array<object>;
	OriginalToQuoteHeaderNews?: { [key: string]: object };
	QtnHeaderSourceTargetIds?: { [key: number]: number };
	PrcItemSourceTargetIds?: Array<{ key: string, value: string }>;
	BoqItemSourceTargetIds?: Array<{ key: string, value: string }>;
	ReplaceItemSourceTargetIds?: { [key: number]: number };
	BidderCommentsToSave?: Array<object>;
	AllQuoteIds?: Array<number>;
	PrcGeneralsToSave?: Array<object>;
	ModifiedQuoteIds?: Array<number>;
}