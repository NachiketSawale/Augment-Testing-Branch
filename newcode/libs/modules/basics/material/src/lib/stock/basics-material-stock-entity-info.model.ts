/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { BasicsMaterialStockDataService } from './basics-material-stock-data.service';
import { BasicsMaterialStockLayoutService } from './basics-material-stock-layout.service';
import { IMaterial2ProjectStockEntity } from '../model/entities/material-2-project-stock-entity.interface';
import { BasicsMaterialStockValidationService } from './basics-material-stock-validation.service';

/**
 * Basics Material Stock Module Info
 */
export const BASICS_MATERIAL_STOCK_ENTITY_INFO = EntityInfo.create<IMaterial2ProjectStockEntity>({
	grid: {
		title: {text: 'Material Stock List', key: 'basics.material.stockList.stockListTitle'}
	},
	form: {
		containerUuid: '34f41831bacd4e979edd8f0a9efd101d',
		title: {text: 'Material Stock List Detail', key: 'basics.material.stockList.stockListDetailTitle'},
	},
	dataService: ctx => ctx.injector.get(BasicsMaterialStockDataService),
	validationService: (ctx) => ctx.injector.get(BasicsMaterialStockValidationService),
	dtoSchemeId: {moduleSubModule: 'Basics.Material', typeName: 'Material2ProjectStockDto'},
	permissionUuid: 'd5aaf97f50e24a83831b8c3d07d15fb9',
	layoutConfiguration: context => {
		return context.injector.get(BasicsMaterialStockLayoutService).generateLayout();
	}
});