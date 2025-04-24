/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
 
import { EntityInfo } from '@libs/ui/business-base';

import {EstimateRuleType} from '@libs/estimate/interfaces';
import {
    ProjectEstimateRuleDataService,
    ProjectEstimateRuleLayoutService,
    ProjectEstimateRulesBehavior,
    ProjectEstimateRuleValidationService
} from '@libs/project/rule';
import {IProjectEstimateRuleEntity} from '@libs/project/interfaces';


 export const PROJECT_ESTIMATE_RULES_ENTITY_INFO: EntityInfo = EntityInfo.create<IProjectEstimateRuleEntity> ({
     grid: {
         title: {key: 'project.rule' + '.container.title'},
         containerUuid: 'f0930caddf2c4043b08b24661a683bc4',
         treeConfiguration:true,
         behavior: ctx => ctx.injector.get(ProjectEstimateRulesBehavior)
     },
                
     dataService: ctx => ctx.injector.get(ProjectEstimateRuleDataService),
     dtoSchemeId: {moduleSubModule: 'Estimate.Rule', typeName: 'PrjEstRuleDto'},
     validationService: context => context.injector.get(ProjectEstimateRuleValidationService),
     permissionUuid: 'f0930caddf2c4043b08b24661a683bc4',
     layoutConfiguration: context => {
         return context.injector.get(ProjectEstimateRuleLayoutService).generateLayout(EstimateRuleType.ProjectRule);
     }        
 });