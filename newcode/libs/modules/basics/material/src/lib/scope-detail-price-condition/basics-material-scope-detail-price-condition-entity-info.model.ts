/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsSharedPriceConditionEntityInfo } from '@libs/basics/shared';
import { BasicsMaterialScopeDetailPriceConditionDataService } from './basics-material-scope-detail-price-condition-data.service';
import { BasicsMaterialScopeDetailPriceConditionValidationService } from './basics-material-scope-detail-price-condition-validation.service';

/**
 * Basics Material scope detail price condition Module Info
 */
export const BASICS_MATERIAL_SCOPE_DETAIL_PRICE_CONDITION_ENTITY_INFO = BasicsSharedPriceConditionEntityInfo.create({
	gridContainerUuid: '11a499665f2e92d41e3c1743ffef757f',
	gridTitle: { text: 'Scope Price Condition', key: 'basics.material.scopeDetail.priceConditionTitle' },
	dataService: (cxt) => cxt.injector.get(BasicsMaterialScopeDetailPriceConditionDataService),
	validationService: (cxt) => cxt.injector.get(BasicsMaterialScopeDetailPriceConditionValidationService),
	dtoSchemeConfig: { moduleSubModule: 'Basics.Material', typeName: 'MaterialScopeDetailPcDto' },
});
