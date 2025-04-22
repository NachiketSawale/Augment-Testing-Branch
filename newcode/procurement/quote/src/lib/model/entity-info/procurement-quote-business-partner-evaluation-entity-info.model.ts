/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinesspartnerSharedEvaluationEntityInfoService } from '@libs/businesspartner/shared';
import { ProcurementQuoteBusinessPartnerEvaluationService } from '../../services/procurement-quote-business-partner-evaluation-data.service';
import { IQuoteHeaderEntity } from '../entities/quote-header-entity.interface';
import { QuoteHeaderEntityComplete } from '../entities/quote-header-entity-complete.class';

export const QUOTE_BUSINESS_PARTNER_EVALUATION_ENTITY_INFO = BusinesspartnerSharedEvaluationEntityInfoService.create<IQuoteHeaderEntity, IQuoteHeaderEntity, QuoteHeaderEntityComplete>({
	adaptorService: new ProcurementQuoteBusinessPartnerEvaluationService(),
	gridTitle: {
		text: 'Quote Evaluation',
		key: 'businesspartner.main' + '.screenEvaluatoinDailogTitle',
	}
});

