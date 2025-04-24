/*
 * Copyright(c) RIB Software GmbH
 */

import {BusinessModuleInfoBase, EntityInfo, IEntityInfo} from '@libs/ui/business-base';
import {BasicsCostGroupCatalogEntity} from './entities/basics-cost-group-catalog-entity.class';
import {BasicsCostGroupCatalogDataService} from '../services/basics-cost-group-catalog-data.service';

import {prefixAllTranslationKeys} from '@libs/platform/common';
import {BASICS_COST_GROUP_ENTITY_INFO} from './basics-cost-group-entity-info.model';
import {inject} from '@angular/core';
import {BasicsCostGroupDataService} from '../services/basics-cost-group-data.service';
import {ICostGroupEntity} from './entities/cost-group-entity.interface';
import {BasicsCostGroupCatalogValidationService} from '../validation/basics-cost-group-catalog-validation-service';

export class BasicsCostgroupsModuleInfo extends BusinessModuleInfoBase {
    private basicsCostGroupCatalogEntityInfoEvaluated: EntityInfo | null = null;

    public override get internalModuleName(): string {
        return 'basics.costgroups';
    }

    /**
     * Returns the unique internal module name in PascalCase.
     * */
    public override get internalPascalCasedModuleName(){
        return 'Basics.CostGroups';
    }

    public override get entities(): EntityInfo[] {
        return [this.basicsCostGroupCatalogEntityInfo, BASICS_COST_GROUP_ENTITY_INFO,];
    }

    /**
     * Loads the translation file used for workflow main
     */
    public override get preloadedTranslations(): string[] {
        return [this.internalModuleName, 'cloud.common'];
    }

    private get basicsCostGroupCatalogEntityInfo(): EntityInfo {
        if (this.basicsCostGroupCatalogEntityInfoEvaluated === null) {
            const basicsCostGroupCatalogEntitySettings: IEntityInfo<BasicsCostGroupCatalogEntity> = {
                grid: {
                    title: {text: 'Cost Group Catalog', key: this.internalModuleName + '.listCostGroupCatalogTitle'}
                },
                form: {
                    title: {
                        text: 'Cost Group Catalog Details',
                        key: this.internalModuleName + '.detailCostGroupCatalogTitle'
                    },
                    containerUuid: '950e80bb6ef44857bec647e238598c5e'
                },
                dataService: (ctx) => ctx.injector.get(BasicsCostGroupCatalogDataService),
                validationService: (ctx) => ctx.injector.get(BasicsCostGroupCatalogValidationService),
                dtoSchemeId: {moduleSubModule: 'Basics.CostGroups', typeName: 'CostGroupCatDto'},
                permissionUuid: '3fef67f4c51daf48775e7c16841cfca2',
                layoutConfiguration: {
                    groups: [{
                        gid: 'default',
                        attributes: ['Code', 'DescriptionInfo', 'IsLive']
                    }],
                    overloads: {},
                    labels: {
                        ...prefixAllTranslationKeys('cloud.common.', {
                            Code: {key: 'entityCode'},
                            DescriptionInfo: {key: 'entityDescription'},
                        }),
                        ...prefixAllTranslationKeys('basics.costgroups.', {
                            IsLive: {key: 'islive'}
                        }),
                    },
                },
            };
            this.basicsCostGroupCatalogEntityInfoEvaluated = EntityInfo.create(basicsCostGroupCatalogEntitySettings);
        }
        return this.basicsCostGroupCatalogEntityInfoEvaluated;
    }

    /**
     * Returns the translation container UUID for the basics costgroup module.
     */
    protected override get translationContainer(): string | undefined {
        return '329649779916429f8c80fd9733309046';
    }

    //todo: how to add the cellchange to costgroup list
    public cellChangeCallBack(item: ICostGroupEntity, field: string) {
        // var field = arg.grid.getColumns()[arg.cell].field;
        if (field === 'LeadQuantityCalc' || field === 'NoLeadQuantity' || field ==='UomFk') {
            const basicsCostGroupDataService = inject(BasicsCostGroupDataService);
            basicsCostGroupDataService.calculateQuantity(item, field);
        }
    }
}
