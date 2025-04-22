/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { ProcurementModule } from '@libs/procurement/shared';
import { IStockTotalVEntity } from '../entities/stock-total-ventity.interface';
import { ProcurementStockTotalBehaviorService } from '../../behaviors/procurement-stock-total-behavior.service';
import { ProcurementStockTotalLayoutService } from '../../services/layouts/procurement-stock-total-layout.service';
import { ProcurementStockTotalDataService } from '../../services/procurement-stock-total-data.service';

export const PROCUREMENT_STOCK_TOTAL_ENTITY_INFO = EntityInfo.create<IStockTotalVEntity>({
	grid: {
		title: { text: 'Stock Total', key: 'procurement.stock.title.stocktotal' },
		behavior: (ctx) => ctx.injector.get(ProcurementStockTotalBehaviorService),
	},
	form: {
		containerUuid: 'ded559386d1c4db6a5773e626b3b2762',
		title: { text: 'Stock Total', key: 'procurement.stock.title.stocktotalDetail' },
	},
	permissionUuid: '18c130e2310242069db7e14c90f7469b',
	dataService: (ctx) => ctx.injector.get(ProcurementStockTotalDataService),
	dtoSchemeId: { moduleSubModule: ProcurementModule.Stock, typeName: 'StockTotalVDto' },
	layoutConfiguration: (context) => {
		return context.injector.get(ProcurementStockTotalLayoutService).generateLayout();
	}
});
