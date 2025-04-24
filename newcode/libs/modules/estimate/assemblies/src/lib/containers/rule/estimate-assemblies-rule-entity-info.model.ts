/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
 
import { EntityInfo } from '@libs/ui/business-base';
import { EstimateAssembliesRuleDataService } from './estimate-assemblies-rule-data.service';
import {IEstimateAssembliesRuleEntity} from '../../model/entities/estimate-assemblies-rule-entity.interface';
import {IGridTreeConfiguration} from '@libs/ui/common';
import {EstimateAssembliesRuleLayoutService} from './estimate-assemblies-rule-layout.service';
import {EstimateRuleType} from '@libs/estimate/interfaces';
import { EstimateAssembliesRuleBehavior } from './estimate-assemblies-rule-behavior.service';


 export const ESTIMATE_ASSEMBLIES_RULE_ENTITY_INFO: EntityInfo = EntityInfo.create<IEstimateAssembliesRuleEntity> ({
                grid: {
                    title: {key: 'estimate.assemblies' + '.containers.rules'},
                    treeConfiguration: ctx => {
                        return {
                            parent: function (entity: IEstimateAssembliesRuleEntity) {
                                const service = ctx.injector.get(EstimateAssembliesRuleDataService);
                                return service.parentOf(entity);
                            },
                            children: function (entity: IEstimateAssembliesRuleEntity) {
                                const service = ctx.injector.get(EstimateAssembliesRuleDataService);
                                return service.childrenOf(entity);
                            }
                        } as IGridTreeConfiguration<IEstimateAssembliesRuleEntity>;
                    },
                    behavior: ctx => ctx.injector.get(EstimateAssembliesRuleBehavior)
                },
                
                dataService: ctx => ctx.injector.get(EstimateAssembliesRuleDataService),
                dtoSchemeId: {moduleSubModule: 'Estimate.Rule', typeName: 'EstRuleDto'},
                permissionUuid: '22860B73D4464E6ABDF7FC9F7216A397',
                 layoutConfiguration: context => {
                    return context.injector.get(EstimateAssembliesRuleLayoutService).generateLayout(EstimateRuleType.AssemblyRule);
                 }
            });