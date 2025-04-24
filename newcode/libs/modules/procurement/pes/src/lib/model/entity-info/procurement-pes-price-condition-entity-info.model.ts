/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedPriceConditionEntityInfo } from '@libs/basics/shared';
import { PROCUREMENT_PES_PRICE_CONDITION_DATA_TOKEN } from '../../services/procurement-pes-price-condition-data.service';
import { PROCUREMENT_PES_PRICE_CONDITION_PARAM_DATA_TOKEN } from '../../services/procurement-pes-price-condition-param-data.service';
import { ProcurementPesPriceConditionValidationService } from '../../services/validations/procurement-pes-price-condition-validation.service';

/**
 * procurement pes price condition Module Info
 */
export const PROCUREMENT_PES_PRICE_CONDITION_ENTITY_INFO = BasicsSharedPriceConditionEntityInfo.create({
	gridContainerUuid: 'fb2e7177d6c041d384f8b3009351840d',
	permissionUuid: '69bf07aa9c9e4ff7b19d28969d98f9ae',
	gridTitle: { text: 'Price Condition', key: 'procurement.pes.priceConditionTitle' },
	dataService: PROCUREMENT_PES_PRICE_CONDITION_DATA_TOKEN,
	dtoSchemeConfig: { moduleSubModule: 'Procurement.Pes', typeName: 'PesItemPriceConditionDto' },
	validationService: (cxt) => cxt.injector.get(ProcurementPesPriceConditionValidationService),
	paramConfig: {
		gridContainerUuid: '5d7db60f107f416a9f99233d90a4ac81',
		permissionUuid: 'fce1713e974b48d5b58282638e65f206',
		dataServiceToken: PROCUREMENT_PES_PRICE_CONDITION_PARAM_DATA_TOKEN,
	},
});
