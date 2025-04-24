import { PrcItemScopeEntityInfoSeries } from '@libs/procurement/common';
import { RequisitionItemScopeSeriesService } from '../../services/requisition-item-scope-series.service';

const scopeEntityInfoSeries = new PrcItemScopeEntityInfoSeries({
	services: RequisitionItemScopeSeriesService,
});

export const PROCUREMENT_REQUISITION_ITEM_SCOPE_ENTITY_INFO_SERIES = scopeEntityInfoSeries.create();
