/*
 * Copyright(c) RIB Software GmbH
 */

import { PrcItemScopeEntityInfoSeries } from '@libs/procurement/common';
import { ProcurementQuoteItemScopeSeriesService } from '../../services/quote-item-scope-series.service';

const scopeEntityInfoSeries = new PrcItemScopeEntityInfoSeries({
	services: ProcurementQuoteItemScopeSeriesService
});

export const PROCUREMENT_QUOTE_ITEM_SCOPE_ENTITY_INFO_SERIES = scopeEntityInfoSeries.create();