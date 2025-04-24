/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { BasicsPriceConditionDataService } from './basics-price-condition-data.service';
import { BasicsPriceConditionLayoutService } from './basics-price-condition-layout.service';
import { IPriceConditionEntity } from '../model/entities/price-condition-entity.interface';
import { BasicsPriceConditionValidationService } from './basics-price-condition-validation.service';

/**
 * Basics Price Condition Module Info
 */
export const BASICS_PRICE_CONDITION_ENTITY_INFO = EntityInfo.create<IPriceConditionEntity>({
	grid: {
		title: { text: 'Price Condition', key: 'basics.pricecondition.priceConditionGridTitle' },
	},
	form: {
		containerUuid: '1e5899c725b1444e9585689c88dc2911',
		title: { text: 'Price Condition Detail', key: 'basics.pricecondition.priceConditionFormTitle' },
	},
	dataService: (ctx) => ctx.injector.get(BasicsPriceConditionDataService),
	validationService: (ctx) => ctx.injector.get(BasicsPriceConditionValidationService),
	dtoSchemeId: { moduleSubModule: 'Basics.PriceCondition', typeName: 'PriceConditionDto' },
	permissionUuid: 'e4aac153b33a433ea476691ff66838a3',
	layoutConfiguration: (context) => {
		return context.injector.get(BasicsPriceConditionLayoutService).generateLayout();
	},
});
