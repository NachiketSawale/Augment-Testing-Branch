/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsCompanyStockEvaluationRuleDataService } from '../services/basics-company-stock-evaluation-rule-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { IStockEvaluationRule4CompEntity } from '@libs/basics/interfaces';


 export const BASICS_COMPANY_STOCK_EVALUATION_RULE_ENTITY_INFO: EntityInfo = EntityInfo.create<IStockEvaluationRule4CompEntity> ({
                grid: {
                    title: {key: 'basics.company' + '.StockEvaluationRule4CompTitle'}
                },
                form: {
			    title: { key: 'basics.company' + '.StockEvaluationRule4CompDetailTitle' },
			    containerUuid: '5b80291b17714d7dab952bcd22ca5b26',
		        },
                dataService: ctx => ctx.injector.get(BasicsCompanyStockEvaluationRuleDataService),
                dtoSchemeId: {moduleSubModule: 'Basics.Company', typeName: 'StockEvaluationRule4CompDto'},
                permissionUuid: '3b739717fa8e4a04941a5824a1f606de',
	             layoutConfiguration: {
					 groups: [
						 {
							 gid: 'Basic Data',
							 attributes: ['StockValuationRuleFk'],
						 }
					 ],
					 overloads: {
						 StockValuationRuleFk:BasicsSharedCustomizeLookupOverloadProvider.provideProjectStockValuationRuleLookupOverload(true),
					 },
					 labels: {
						 ...prefixAllTranslationKeys('basics.company.', {
							 StockValuationRuleFk: {key: 'stockValuationRule'}
						 }),
					 }
				 }

            });