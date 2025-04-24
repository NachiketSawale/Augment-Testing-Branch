/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { ProcurementModule } from '@libs/procurement/shared';
import { IStockTransactionEntity } from '../entities/stock-transaction-entity.interface';
import { ProcurementStockTransactionLayoutService } from '../../services/layouts/procurement-stock-transaction-layout.service';
import { ProcurementStockTransactionDataService } from '../../services/procurement-stock-transaction-data.service';
import { ProcurementStockTransactionBehaviorService } from '../../behaviors/procurement-stock-transaction-behavior.service';
import { BasicsSharedPrcStockTransactionTypeLookupService, BasicsSharedSystemOptionLookupService } from '@libs/basics/shared';
import { ProcurementStockTransactionValidationService } from '../../services/validations/procurement-stock-transaction-validation.service';

export const PROCUREMENT_STOCK_TRANSACTION_ENTITY_INFO = EntityInfo.create<IStockTransactionEntity>({
	grid: {
		title: { text: 'Transaction', key: 'procurement.stock.title.transaction' },
		behavior: (ctx) => ctx.injector.get(ProcurementStockTransactionBehaviorService),
	},
	form: {
		containerUuid: '1dc90569450f47e5b10ecd0ce7cf4ca4',
		title: { text: 'Transaction Detail', key: 'procurement.stock.title.transactionDetail' },
	},
	permissionUuid: '6c64f212eaa54bd6b7738ccb80094cdb',
	dataService: (ctx) => ctx.injector.get(ProcurementStockTransactionDataService),
	validationService: (context) => context.injector.get(ProcurementStockTransactionValidationService),
	dtoSchemeId: { moduleSubModule: ProcurementModule.Stock, typeName: 'StockTransactionDto' },
	layoutConfiguration: (context) => {
		return context.injector.get(ProcurementStockTransactionLayoutService).generateLayout();
	},
	prepareEntityContainer: async (ctx) => {
		const basicsSharedSystemOptionLookupService = ctx.injector.get(BasicsSharedSystemOptionLookupService);
		const transactionTypeLookupService = ctx.injector.get(BasicsSharedPrcStockTransactionTypeLookupService);
		await Promise.all([basicsSharedSystemOptionLookupService.getList(), transactionTypeLookupService.getList()]);
	},
});
