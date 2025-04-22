/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { ProcurementContractTransactionDataService } from '../../services/procurement-contract-transaction-data.service';
import { ProcurementContractTransactionLayoutService } from '../../services/procurement-contract-transaction-layout.service';
import { ProcurementContractTransactionBehavior } from '../../behaviors/procurement-contract-transaction-behavior.service';
import { IConTransactionEntity } from '../entities/con-transaction-entity.interface';

export const PROCUREMENT_CONTRACT_TRANSACTION_ENTITY_INFO = EntityInfo.create<IConTransactionEntity>({
	grid: {
		title: { text: 'Transactions', key: 'procurement.common.transaction.title' },
		behavior:ctx=>ctx.injector.get(ProcurementContractTransactionBehavior)
	},
	form: {
		containerUuid: 'cce3de0c40884576a377d1ecb4a96953',
		title: { text: 'Transaction Detail', key: 'procurement.common.transaction.detailTitle' },
	},
	dataService: ctx => ctx.injector.get(ProcurementContractTransactionDataService),
	dtoSchemeId: { moduleSubModule: 'Procurement.Contract', typeName: 'ConTransactionDto' },
	permissionUuid: 'd91c9fc9474e446ca31d1e7a0739f9c6',
	layoutConfiguration: context => {
		return context.injector.get(ProcurementContractTransactionLayoutService).generateConfig();
	}
});