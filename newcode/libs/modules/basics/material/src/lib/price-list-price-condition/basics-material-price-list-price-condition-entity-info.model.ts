/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsSharedPriceConditionEntityInfo } from '@libs/basics/shared';
import { BasicsMaterialPriceListPriceConditionDataService } from './basics-material-price-list-price-condition-data.service';
import { BasicsMaterialPriceListPriceConditionValidationService } from './basics-material-price-list-price-condition-validation.service';

/**
 * Basics Material price list price condition Module Info
 */
export const BASICS_MATERIAL_PRICE_LIST_PRICE_CONDITION_ENTITY_INFO = BasicsSharedPriceConditionEntityInfo.create({
	gridContainerUuid: '51054c9176dd42d0b029c58a4f75bad0',
	permissionUuid:'5e7398f8048e4862802e7d146bbc9e8c',
	gridTitle: { text: 'Price List Condition', key: 'basics.material.priceList.priceListPriceConditionTitle' },
	dataService: (context) => context.injector.get(BasicsMaterialPriceListPriceConditionDataService),
	validationService: (context) => context.injector.get(BasicsMaterialPriceListPriceConditionValidationService),
	dtoSchemeConfig: { moduleSubModule: 'Basics.Material', typeName: 'MaterialPriceListConditionDto' },
});
