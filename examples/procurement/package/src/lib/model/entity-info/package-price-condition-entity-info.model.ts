import { BasicsSharedPriceConditionEntityInfo } from '@libs/basics/shared';
import { PROCUREMENT_PACKAGE_PRICE_CONDITION_DATA_TOKEN } from '../../services/procurement-package-price-condition-data.service';
import { ProcurementQuotePriceConditionValidationService } from '../../services/validations/package-price-condition-validation.service';
import { PROCUREMENT_Package_PRICE_CONDITION_PARAM_DATA_TOKEN } from '../../services/procurement-package-price-condition-param-data.service';



export const PACKAGE_PRICE_CONDITION_ENTITY_INFO = BasicsSharedPriceConditionEntityInfo.create({
	gridContainerUuid: '68370c45d20f419db3ebc8400428a984',
	permissionUuid: 'dbc3d95bfe71420b9c140e9e710b9035',
	gridTitle: { text: 'Price Condition', key: 'basics.material.record.priceConditionTitle' },
	dataService:PROCUREMENT_PACKAGE_PRICE_CONDITION_DATA_TOKEN,
	validationService: (cxt) => cxt.injector.get(ProcurementQuotePriceConditionValidationService),
	dtoSchemeConfig: { moduleSubModule: 'Basics.Material', typeName: 'MaterialPriceConditionDto' },
	paramConfig:{
		gridContainerUuid:'2760a9094c9641548ee6efbab089cee4',
		permissionUuid:'e5c885509a824e5880e4001ea51f38ca',
		dataServiceToken:PROCUREMENT_Package_PRICE_CONDITION_PARAM_DATA_TOKEN
	}
});