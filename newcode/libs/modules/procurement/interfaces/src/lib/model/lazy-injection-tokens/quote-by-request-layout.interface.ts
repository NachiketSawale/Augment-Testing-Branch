/*
 * Copyright(c) RIB Software GmbH
 */

import { ILayoutConfiguration } from '@libs/ui/common';
import { IQuote2RfqVEntity } from '../entities/compare-quote2rfq-entity.interface';
import { LazyInjectionToken } from '@libs/platform/common';

/**
 * Defines the layout service used to prepare quote container.
 */
export interface IQuoteByRequestLayout {
    /**
     * Prepares the layout for quote container.
     */
    generateLayout(): ILayoutConfiguration<IQuote2RfqVEntity>
}

/**
 * Lazy injection token used to access quote by request layout service.
 */
export const QUOTE_BY_REQUEST_LAYOUT_TOKEN = new LazyInjectionToken<IQuoteByRequestLayout>('quote-by-request-layout');