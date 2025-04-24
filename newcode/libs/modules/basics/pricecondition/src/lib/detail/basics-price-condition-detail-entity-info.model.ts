/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { BasicsPriceConditionDetailDataService } from './basics-price-condition-detail-data.service';
import { BasicsPriceConditionDetailLayoutService } from './basics-price-condition-detail-layout.service';
import { IPriceConditionDetailEntity } from '../model/entities/price-condition-detail-entity.interface';
import { BasicsPriceConditionDetailValidationService } from './basics-price-condition-detail-validation.service';

/**
 * Basics Price Condition Detail Module Info
 */
export const BASICS_PRICE_CONDITION_DETAIL_ENTITY_INFO = EntityInfo.create<IPriceConditionDetailEntity>({
	grid: {
		title: { text: 'Price Condition Detail', key: 'basics.pricecondition.priceConditionDetailGridTitle' },
	},
	form: {
		containerUuid: '8fa442458eac4306bc1a85bd9360643f',
		title: { text: 'Price Condition Detail', key: 'basics.pricecondition.priceConditionDetailFormTitle' },
	},
	dataService: (ctx) => ctx.injector.get(BasicsPriceConditionDetailDataService),
	validationService: (ctx) => ctx.injector.get(BasicsPriceConditionDetailValidationService),
	dtoSchemeId: { moduleSubModule: 'Basics.PriceCondition', typeName: 'PriceConditionDetailDto' },
	permissionUuid: 'ef70b73523424e6ab26a2848ad4acb47',
	layoutConfiguration: (context) => {
		return context.injector.get(BasicsPriceConditionDetailLayoutService).generateLayout();
	},
});
