/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedPriceConditionEntityInfo } from '@libs/basics/shared';
import {
	ProcurementQuotePriceConditionDataService
} from '../../services/procurement-quote-price-condition-data.service';
import {
	ProcurementQuotePriceConditionValidationService
} from '../../services/validations/quote-price-condition-validation.service';

export const QUOTE_PRICE_CONDITION_ENTITY_INFO = BasicsSharedPriceConditionEntityInfo.create({
	gridContainerUuid: '8b99f411368a46c18281a54713e58bda',
	permissionUuid: 'a1f1590e7bb14bf2a326b4c9974233d1',
	gridTitle: { text: 'Price Condition', key: 'basics.material.record.priceConditionTitle' },
	dataService: (cxt) => cxt.injector.get(ProcurementQuotePriceConditionDataService),
	validationService: (cxt) => cxt.injector.get(ProcurementQuotePriceConditionValidationService),
	dtoSchemeConfig: { moduleSubModule: 'Basics.Material', typeName: 'MaterialPriceConditionDto' }
});