/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinesspartnerSharedEvaluationEntityInfoService } from '@libs/businesspartner/shared';
import { ProcurementQuoteEvaluationService } from '../../services/procurement-quote-evaluation-data.service';
import { IQuoteHeaderEntity } from '../entities/quote-header-entity.interface';
import { QuoteHeaderEntityComplete } from '../entities/quote-header-entity-complete.class';

export const QUOTE_EVALUATION_ENTITY_INFO = BusinesspartnerSharedEvaluationEntityInfoService.create<IQuoteHeaderEntity, IQuoteHeaderEntity, QuoteHeaderEntityComplete>({
	adaptorService: new ProcurementQuoteEvaluationService(),
	gridTitle: {
		text: 'Quote Evaluation',
		key: 'procurement.quote' + '.evaluatoinContainerTitle',
	}
});