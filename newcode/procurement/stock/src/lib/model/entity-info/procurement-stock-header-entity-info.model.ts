/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProcurementModule } from '@libs/procurement/shared';
import { IStockHeaderVEntity } from '../entities/stock-header-ventity.interface';
import { ProcurementStockHeaderBehavior } from '../../behaviors/procurement-stock-header-behavior.service';
import { ProcurementStockHeaderDataService } from '../../services/procurement-stock-header-data.service';
import { ProcurementStockHeaderLayoutService } from '../../services/layouts/procurement-stock-header-layout.service';
import { ProcurementStockHeaderValidationService } from '../../services/validations/procurement-stock-header-validation.service';

export const PROCUREMENT_STOCK_HEADER_ENTITY_INFO = EntityInfo.create<IStockHeaderVEntity>({
	grid: {
		title: { text: 'Stock Header', key: 'procurement.stock.title.header' },
		behavior: (ctx) => ctx.injector.get(ProcurementStockHeaderBehavior),
	},
	form: {
		containerUuid: '27a6fd3705d84c6bb245b7a9ae80ffd8',
		title: { text: 'Stock Header Detail', key: 'procurement.stock.title.headerDetail' },
	},
	permissionUuid: '10119ef5d56d4591ba1f44a8b3c279b4',
	validationService: (ctx) => ctx.injector.get(ProcurementStockHeaderValidationService),
	dataService: (ctx) => ctx.injector.get(ProcurementStockHeaderDataService),
	dtoSchemeId: { moduleSubModule: ProcurementModule.Stock, typeName: 'StockHeaderVDto' },
	layoutConfiguration: (context) => {
		return context.injector.get(ProcurementStockHeaderLayoutService).generateLayout();
	},
});
