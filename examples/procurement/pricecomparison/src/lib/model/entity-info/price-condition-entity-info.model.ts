/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedPriceConditionEntityInfo } from '@libs/basics/shared';
import {
	ProcurementPriceComparisonPriceConditionValidationService
} from '../../services/price-condition-validation.service';
import { ProcurementPriceComparisonPriceConditionDataService } from '../../services/price-condition-data.service';

export const PRICE_COMPARISON_PRICE_CONDITION_ENTITY_INFO = BasicsSharedPriceConditionEntityInfo.createPriceConditionEntityInfo({
	gridContainerUuid: '377fd9f4705b404290cd0b68e1101211',
	permissionUuid: '377fd9f4705b404290cd0b68e1101211',
	gridTitle: { text: 'Price Condition', key: 'basics.material.record.priceConditionTitle' },
	dataService: (cxt) => cxt.injector.get(ProcurementPriceComparisonPriceConditionDataService),
	validationService: (cxt) => cxt.injector.get(ProcurementPriceComparisonPriceConditionValidationService),
	dtoSchemeConfig: { moduleSubModule: 'Basics.Material', typeName: 'MaterialPriceConditionDto' }
});