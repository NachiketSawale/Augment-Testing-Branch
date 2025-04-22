/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedPriceConditionEntityInfo } from '@libs/basics/shared';
import { WipPriceConditionParamDataService } from '../services/sales-wip-price-condition-params-data.service';


export const SALES_WIP_PRICE_CONDITION_ENTITY_INFO = BasicsSharedPriceConditionEntityInfo.createPriceConditionParamEntityInfo({
	gridContainerUuid: '7962674ba2e94eae92a037e00fa8835d',
	permissionUuid:'4699f53aa0f1400c97e053b49315e036',
	dataServiceToken: WipPriceConditionParamDataService
});