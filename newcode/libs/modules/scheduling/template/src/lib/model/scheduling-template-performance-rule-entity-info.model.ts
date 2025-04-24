/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { SchedulingTemplatePerformanceRuleDataService } from '../services/scheduling-template-performance-rule-data.service';
import { IPerformanceRuleEntity } from './entities/performance-rule-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';


 export const SCHEDULING_TEMPLATE_PERFORMANCE_RULE_ENTITY_INFO: EntityInfo = EntityInfo.create<IPerformanceRuleEntity> ({
                grid: {
                    title: {key: 'scheduling.template' + '.performanceRuleGridHeader'},
                },
	             form: {
		             title: { key: 'scheduling.template' + '.performanceRuleDetailHeader' },
		             containerUuid: '8cbbced1a6e142d095f19e0387af0664',
	              },
                dataService: ctx => ctx.injector.get(SchedulingTemplatePerformanceRuleDataService),
                dtoSchemeId: {moduleSubModule: 'Scheduling.Template', typeName: 'PerformanceRuleDto'},
                permissionUuid: 'a7f6eea9117c4f72bb73f88709f6583d',
	 layoutConfiguration: {
		 groups: [
			 {gid: 'default',attributes: ['Quantity','Resource','CommentText','UomFk1','UomFk2'/*,'ActivityTemplateFk','PerformanceSheetFk','UomFk1','UomFk2'*/,]},],
		    overloads: {
			    UomFk1:BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			    UomFk2 :BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
		 },
		 labels: {
			 ...prefixAllTranslationKeys('cloud.common.',{
				 CommentText :{ key: 'entityComment'},

			 }),
			 ...prefixAllTranslationKeys('scheduling.template.',{
				 Resource :{ key: 'resource'},
				 UomFk1 :{ key: 'uomFk1'},
				 UomFk2 :{ key: 'uomFk2'},
			 })
		 }
	  },
            });