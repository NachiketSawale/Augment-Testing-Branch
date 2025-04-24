/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsSharedPriceConditionEntityInfo } from '@libs/basics/shared';
import { BasicsMaterialPriceConditionDataService } from './basics-material-price-condition-data.service';
import { BasicsMaterialPriceConditionValidationService } from './basics-material-price-condition-validation.service';

/**
 * Basics Material Price condition Module Info
 */
export const BASICS_MATERIAL_PRICE_CONDITION_ENTITY_INFO = BasicsSharedPriceConditionEntityInfo.create({
	gridContainerUuid: '13f6aa1f21cf42bdb3b9219361284e59',
	gridTitle: { text: 'Price Condition', key: 'basics.material.record.priceConditionTitle' },
	dataService: (cxt) => cxt.injector.get(BasicsMaterialPriceConditionDataService),
	validationService: (cxt) => cxt.injector.get(BasicsMaterialPriceConditionValidationService),
	dtoSchemeConfig: { moduleSubModule: 'Basics.Material', typeName: 'MaterialPriceConditionDto' },
});
