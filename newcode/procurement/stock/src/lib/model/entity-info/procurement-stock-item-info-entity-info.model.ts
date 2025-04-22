/*
 * Copyright(c) RIB Software GmbH
 */

import { CompositeGridConfigurationToken, CompositeGridContainerComponent, EntityInfo } from '@libs/ui/business-base';


import { ProcurementStockItemInfoBehavior } from '../../behaviors/procurement-stock-item-info-behavior.service';

import { ProcurementStockItemInfoComponent } from '../../components/item-info/item-info.component';

import { IStockItemInfoVEntity } from '../entities/stock-item-info-ventity.interface';
import { ProcurementStockItemInfoDataService } from '../../services/procurement-stock-item-info-data.service';
import { ProcurementStockItemInfoLayoutService } from '../../services/layouts/procurement-stock-item-info-layout.service';

/**
 * Procurement Stock Item Info Entity Info
 */
export const PROCUREMENT_STOCK_ITEM_INFO_ENTITY_INFO: EntityInfo = EntityInfo.create<IStockItemInfoVEntity>({
	grid: {
		title: { text: 'Contract & PES Information for Stock', key: 'procurement.stock.itemInfoContainerTitle' },
		behavior: (ctx) => ctx.injector.get(ProcurementStockItemInfoBehavior),
		containerType: CompositeGridContainerComponent,
		providers: [
			{
				provide: CompositeGridConfigurationToken,
				useValue: {
					maxTopLeftLength: 120,
					topLeftContainerType: ProcurementStockItemInfoComponent,
				},
			},
		],
		containerUuid:'dad7237be98841deb372c1572a39188f'
	},
	dtoSchemeId: {
		moduleSubModule: 'Procurement.Stock',
		typeName: 'StockItemInfoVDto',
	},
	permissionUuid: '06eaf2abd89c474b9309c355710b29a8',
	dataService: (ctx) => ctx.injector.get(ProcurementStockItemInfoDataService),
	layoutConfiguration: (context) => {
		return context.injector.get(ProcurementStockItemInfoLayoutService).generateLayout(context);
	}
});
