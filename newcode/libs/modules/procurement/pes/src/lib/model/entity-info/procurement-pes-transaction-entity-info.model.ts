/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { ProcurementPesTransactionBehavior } from '../../behaviors/procurement-pes-transaction-behavior.service';
import { ProcurementPesTransactionLayoutService } from '../../services/layouts/procurement-pes-transaction-layout.service';
import { ProcurementPesTransactionDataService } from '../../services/procurement-pes-transaction-data.service';
import { IPesTransactionEntity } from '../entities';

export const PROCUREMENT_PES_TRANSACTION_ENTITY_INFO = EntityInfo.create<IPesTransactionEntity>({
	grid: {
		title: { text: 'Transactions', key: 'procurement.common.transaction.title' },
		behavior:ctx=>ctx.injector.get(ProcurementPesTransactionBehavior)
	},
	form: {
		containerUuid: '67a0d143fa96477f8f6583edc3967c31',
		title: { text: 'Transaction Detail', key: 'procurement.common.transaction.detailTitle' },
	},
	dataService: ctx => ctx.injector.get(ProcurementPesTransactionDataService),
	dtoSchemeId: { moduleSubModule: 'Procurement.Pes', typeName: 'PesTransactionDto' },
	permissionUuid: 'd551f91efa4ab7e13ba68c295ca6933a',
	layoutConfiguration: context => {
		return context.injector.get(ProcurementPesTransactionLayoutService).generateConfig();
	}
});