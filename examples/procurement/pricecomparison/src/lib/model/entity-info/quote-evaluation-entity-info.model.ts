/*
 * Copyright(c) RIB Software GmbH
 */
import { BusinesspartnerSharedEvaluationEntityInfoService } from '@libs/businesspartner/shared';
import { IQuoteHeaderEntity, QuoteHeaderEntityComplete } from '@libs/procurement/quote';
import { ProcurementPriceComparisonQuoteEvaluationService } from '../../services/quote-evaluation-data.service';

export const PRICE_COMPARISON_QUOTE_EVALUATION_ENTITY_INFO = BusinesspartnerSharedEvaluationEntityInfoService.create<IQuoteHeaderEntity, IQuoteHeaderEntity, QuoteHeaderEntityComplete>({
	adaptorService: new ProcurementPriceComparisonQuoteEvaluationService(),
	gridTitle: {
		text: 'Quote Evaluation',
		key: 'procurement.quote' + '.evaluatoinContainerTitle',
	}
});
