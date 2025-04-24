/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { BasicsMaterialStockTotalDataService } from './basics-material-stock-total-data.service';
import { BasicsMaterialStockTotalBehavior } from './basics-material-stock-total-behavior.service';
import { IBasicsStockTotalEntity } from '@libs/basics/shared';
import { BasicsStockTotalLayoutService } from '@libs/basics/shared';

/**
 * Basics Material Stock Total Module Info
 */
export const BASICS_MATERIAL_STOCK_TOTAL_ENTITY_INFO = EntityInfo.create<IBasicsStockTotalEntity>({
	grid: {
		title: { text: 'Material Stock Total', key: 'basics.material.stockTotal.title' },
		behavior: ctx => ctx.injector.get(BasicsMaterialStockTotalBehavior),
	},
	form: {
		containerUuid: 'fb513658fc0e48f1bfbfd6b370cb44d0',
		title: { text: 'Material Stock Total Detail', key: 'basics.material.stockTotal.detailTitle' },
	},
	dataService: ctx => ctx.injector.get(BasicsMaterialStockTotalDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.Material', typeName: 'Material2StockTotalVDto' },
	permissionUuid: '0b28c1bcc71741239d6fbcb7f137ff20',
	layoutConfiguration: context => {
		return context.injector.get(BasicsStockTotalLayoutService).generateLayout();
	}
});