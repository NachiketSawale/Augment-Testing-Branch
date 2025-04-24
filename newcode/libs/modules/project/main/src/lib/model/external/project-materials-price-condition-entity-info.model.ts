/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsSharedPriceConditionEntityInfo } from '@libs/basics/shared';
import { ProjectMaterialsPriceConditionDataService } from '@libs/project/material';
import { ProjectMaterialsPriceConditionValidationService } from '@libs/project/material';
import { PROJECT_PRICE_CONDITION_PARAM_DATA_TOKEN } from '@libs/project/material';

/**
 * Basics Material Price condition Module Info
 */
export const PROJECT_MATERIALS_PRICE_CONDITION_ENTITY_INFO = BasicsSharedPriceConditionEntityInfo.create({
	gridContainerUuid: '851058B59DAD4C80B0EF544B9DB4DD8C',
	gridTitle: { text: 'Price Condition', key: 'basics.material.record.priceConditionTitle' },
	dataService: (cxt) => cxt.injector.get(ProjectMaterialsPriceConditionDataService),
	validationService: (context) => context.injector.get(ProjectMaterialsPriceConditionValidationService),
	dtoSchemeConfig: { moduleSubModule: 'Basics.Material', typeName: 'MaterialPriceConditionDto' },
	paramConfig:{
		gridContainerUuid:'d0d70f1f6b9c4b16accc03b100855587',
		permissionUuid:'1057666761d54b97a7334d71cdb72ed2',
		dataServiceToken: PROJECT_PRICE_CONDITION_PARAM_DATA_TOKEN
	}
});
