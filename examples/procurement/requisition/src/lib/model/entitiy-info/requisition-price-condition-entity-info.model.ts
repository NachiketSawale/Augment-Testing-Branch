import { BasicsSharedPriceConditionEntityInfo } from '@libs/basics/shared';
import { RequisitionPriceConditionValidationiService } from '../../services/validations/requisition-price-condition-validationi.service';
import { PROCUREMENT_REQUISITION_PRICE_CONDITION_DATA_TOKEN } from '../../services/requisition-price-condition-data.service';
import { PROCUREMENT_REQUISITION_PRICE_CONDITION_PARAM_DATA_TOKEN } from '../../services/requisition-price-condition-param-data.service';

export const PROCUREMENT_REQUISITION_PRICE_CONDITION_ENTITY_INFO = BasicsSharedPriceConditionEntityInfo.create({
	gridContainerUuid: '0cb794a5c72844f1b4cee6400c4570e7',
	gridTitle: { text: 'Price Condition', key: 'basics.material.record.priceConditionTitle' },
	dataService: PROCUREMENT_REQUISITION_PRICE_CONDITION_DATA_TOKEN,
	dtoSchemeConfig: { moduleSubModule: 'Procurement.Common', typeName: 'PrcItemPriceConditionDto' },
	validationService: (cxt) => cxt.injector.get(RequisitionPriceConditionValidationiService),
	paramConfig: {
		gridContainerUuid: 'f35464032873425baea4dffd23e567dc',
		permissionUuid: '50f62bfa980842ee800097b467562ec4',
		dataServiceToken: PROCUREMENT_REQUISITION_PRICE_CONDITION_PARAM_DATA_TOKEN,
	},
});
