/*
 * Copyright(c) RIB Software GmbH
 */
import { ContainerDefinition } from '@libs/ui/container-system';

import { ProcurementStockTotalReconciliationComponent } from '../../components/total-reconciliation/total-reconciliation.component';

/**
 * Entity info for Procurement Stock Total Reconciliation
 */

export const PROCUREMENT_STOCK_TOTAL_RECONCILIATION_ENTITY_INFO: ContainerDefinition = new ContainerDefinition({
	id: 'prc.stock.stocktotal.reconciliation2.grid',
	containerType: ProcurementStockTotalReconciliationComponent,
	uuid: '0780abf4d0174c8cb9827ebd6907ac83',
	title: 'procurement.stock.title.stocktotalReconciliation',
});
