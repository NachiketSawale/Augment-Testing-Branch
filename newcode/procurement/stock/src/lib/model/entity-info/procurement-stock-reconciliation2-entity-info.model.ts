/*
 * Copyright(c) RIB Software GmbH
 */
import { ContainerDefinition } from '@libs/ui/container-system';
import { StockReconciliation2GridComponent } from '../../components/stock-reconciliation/stock-reconciliation2-grid/stock-reconciliation2-grid.component';

export const PROCUREMENT_STOCK_RECONCILIATION2_ENTITY_INFO: ContainerDefinition = new ContainerDefinition({
	id: 'prc.stock.reconciliation2.grid',
	containerType: StockReconciliation2GridComponent,
	uuid: 'ca2124f6e99e494591df3b5892a0a30a',
	title: 'procurement.stock.title.headerReconciliation',
});
