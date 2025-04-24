/*
 * Copyright(c) RIB Software GmbH
 */
import { BusinesspartnerSharedEvaluationEntityInfoService } from '@libs/businesspartner/shared';
import { ProcurementPriceComparisonBusinessPartnerEvaluationService } from '../../services/business-partner-evaluation-data.service';
import { IQuoteHeaderEntity, QuoteHeaderEntityComplete } from '@libs/procurement/quote';

export const PRICE_COMPARISON_BUSINESS_PARTNER_EVALUATION_ENTITY_INFO = BusinesspartnerSharedEvaluationEntityInfoService.create<IQuoteHeaderEntity, IQuoteHeaderEntity, QuoteHeaderEntityComplete>({
	adaptorService: new ProcurementPriceComparisonBusinessPartnerEvaluationService(),
	gridTitle: {
		text: 'Quote Evaluation',
		key: 'businesspartner.main' + '.screenEvaluatoinDailogTitle',
	}
});
