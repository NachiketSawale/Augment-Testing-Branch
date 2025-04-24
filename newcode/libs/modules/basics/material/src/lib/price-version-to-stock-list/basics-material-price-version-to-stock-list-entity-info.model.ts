/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { BasicsMaterialPriceVersionToStockListDataService } from './basics-material-price-version-to-stock-list-data.service';
import { BasicsMaterialPriceVersionToStockListLayoutService } from './basics-material-price-version-to-stock-list-layout.service';
import { IStock2matPriceverEntity } from '../model/entities/stock-2-mat-pricever-entity.interface';
import { BasicsMaterialPriceVersionToStockListValidationService } from './basics-material-price-version-to-stock-list-validation.service';

/**
 * Basics Material Price Version To Stock List Module Info
 */
export const BASICS_MATERIAL_PRICE_VERSION_TO_STOCK_LIST_ENTITY_INFO = EntityInfo.create<IStock2matPriceverEntity>({
	grid: {
		containerUuid: '67707f3826cf42e7944bbf200db5cb35',
		title: {text: 'Price Version To Stock List', key: 'basics.material.priceVersionToStockList.priceVersionToStockListTitle'}
	},
	dataService: ctx => ctx.injector.get(BasicsMaterialPriceVersionToStockListDataService),
	validationService: (ctx) => ctx.injector.get(BasicsMaterialPriceVersionToStockListValidationService),
	dtoSchemeId: {moduleSubModule: 'Basics.Material', typeName: 'Stock2matPriceverDto'},
	permissionUuid: 'd5aaf97f50e24a83831b8c3d07d15fb9',
	layoutConfiguration: context => {
		return context.injector.get(BasicsMaterialPriceVersionToStockListLayoutService).generateLayout();
	}
});