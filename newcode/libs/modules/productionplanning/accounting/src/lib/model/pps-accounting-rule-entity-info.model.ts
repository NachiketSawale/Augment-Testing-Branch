/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';

import { PpsAccountingRuleDataService } from '../services/pps-accounting-rule-data.service';
import { PpsAccountingRuleBehavior } from '../behaviors/pps-accounting-rule-behavior.service';
import { IRuleEntity } from './models';
import { PpsAccountingRuleValidationService } from '../services/pps-accounting-rule-validation.service';


export const PPS_ACCOUNTING_RULE_ENTITY_INFO: EntityInfo = EntityInfo.create<IRuleEntity>({
	grid: {
		title: { key: 'productionplanning.accounting.rule.listTitle' },
		behavior: ctx => ctx.injector.get(PpsAccountingRuleBehavior),
	},
	form: {
		title: { key: 'productionplanning.accounting.rule.detailTitle' },
		containerUuid: '0689edc8f3d64cc78ded0a987c10b55d',
	},
	dataService: ctx => ctx.injector.get(PpsAccountingRuleDataService),
	validationService: ctx => ctx.injector.get(PpsAccountingRuleValidationService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Accounting', typeName: 'RuleDto' },
	permissionUuid: 'ad340a997e8b4ad2876dfdd9d2670656',
	layoutConfiguration: {
		overloads: {
			RuleTypeFk: BasicsSharedLookupOverloadProvider.provideEngineeringAccountingRuleTypeLookupOverload(true),
			ImportFormatFk: BasicsSharedLookupOverloadProvider.provideEngineeringAccountingRuleImportFormatLookupOverload(true),
			MatchFieldFk: BasicsSharedLookupOverloadProvider.provideEngineeringAccountingRuleMatchFieldLookupOverload(true),
		},
		labels: {
			...prefixAllTranslationKeys('productionplanning.accounting.', {
				MatchPattern: {key: 'rule.matchPattern', text: '*Match Pattern'},
				RuleTypeFk: {key: 'rule.ruleTypeFk', text: '*Rule Type'},
				ImportFormatFk: {key: 'rule.importFormatFk', text: '*Import Format'},
				MatchFieldFk: {key: 'rule.matchFieldFk', text: '*Match Field'},
			}),
		}
	}
});