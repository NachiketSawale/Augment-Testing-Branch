/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedPriceConditionEntityInfo } from '@libs/basics/shared';
import { PROCUREMENT_CONTRACT_PRICE_CONDITION_DATA_TOKEN } from '../../services/procurement-contract-price-condition-data.service';
import { ProcurementContractPriceConditionValidationService } from '../../services/procurement-contract-price-condition-validation.service';
import { PROCUREMENT_CONTRACT_PRICE_CONDITION_PARAM_DATA_TOKEN } from '../../services/procurement-contract-price-condition-param-data.service';

/**
 * procurement contract price condition Module Info
 */
export const PROCUREMENT_CONTRACT_PRICE_CONDITION_ENTITY_INFO = BasicsSharedPriceConditionEntityInfo.create(
	{
		gridContainerUuid: '7e92acac64e2497782d6dec303940bb2',
		gridTitle: { text: 'Price Condition', key: 'procurement.common.priceConditionTitle' },
		dataService: PROCUREMENT_CONTRACT_PRICE_CONDITION_DATA_TOKEN,
		dtoSchemeConfig: { moduleSubModule: 'Procurement.Common', typeName: 'PrcItemPriceConditionDto' },
		validationService: (cxt) => cxt.injector.get(ProcurementContractPriceConditionValidationService),
		paramConfig:{
			gridContainerUuid:'1ad2b47c38cb44d6bd75555e82d39e67',
			permissionUuid:'65aabbd453e0452783829cb3cefba94d',
			dataServiceToken: PROCUREMENT_CONTRACT_PRICE_CONDITION_PARAM_DATA_TOKEN
		}
	}
);