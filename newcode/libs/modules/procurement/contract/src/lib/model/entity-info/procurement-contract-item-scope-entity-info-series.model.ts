/*
 * Copyright(c) RIB Software GmbH
 */

import { PrcItemScopeEntityInfoSeries } from '@libs/procurement/common';
import { ProcurementContractItemScopeSeriesService } from '../../services/procurement-contract-item-scope-series.service';

const scopeEntityInfoSeries = new PrcItemScopeEntityInfoSeries({
	services: ProcurementContractItemScopeSeriesService
});

export const PROCUREMENT_CONTRACT_ITEM_SCOPE_ENTITY_INFO_SERIES = scopeEntityInfoSeries.create();