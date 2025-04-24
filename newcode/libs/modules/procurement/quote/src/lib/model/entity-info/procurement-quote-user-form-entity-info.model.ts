/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsSharedUserFormDataEntityInfoFactory, Rubric } from '@libs/basics/shared';
import { IQuoteHeaderEntity } from '../entities/quote-header-entity.interface';
import { QuoteHeaderEntityComplete } from '../entities/quote-header-entity-complete.class';
import { ProcurementQuoteHeaderDataService } from '../../services/quote-header-data.service';

/**
 * Procurement Quote User form entity info model
 */
export const PROCUREMENT_QUOTE_USER_FORM_ENTITY_INFO = BasicsSharedUserFormDataEntityInfoFactory.create<IQuoteHeaderEntity, QuoteHeaderEntityComplete>({
	rubric: Rubric.Quotation,
	permissionUuid: 'ce03f819bcf64d2892c0b3867e310a87',
	gridTitle: {
		key: 'cloud.common.ContainerUserformDefaultTitle'
	},
	
	parentServiceFn: (ctx) => {
		return ctx.injector.get(ProcurementQuoteHeaderDataService);
	},
});