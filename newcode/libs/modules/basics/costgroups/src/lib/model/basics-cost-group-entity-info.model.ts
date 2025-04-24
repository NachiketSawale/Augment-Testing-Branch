/*
 * Copyright(c) RIB Software GmbH
 */

import {EntityInfo} from '@libs/ui/business-base';
import {BasicsCostGroupDataService} from '../services/basics-cost-group-data.service';
import {ICostGroupEntity} from './entities/cost-group-entity.interface';
import {prefixAllTranslationKeys} from '@libs/platform/common';
import {BasicsSharedLookupOverloadProvider} from '@libs/basics/shared';
import {IGridTreeConfiguration} from '@libs/ui/common';
import {BasicsCostGroupBehavior} from '../behaviors/basics-cost-group-behavior.service';
import {BasicsCostGroupValidationService} from '../validation/basics-cost-group-validation.service';


export const BASICS_COST_GROUP_ENTITY_INFO: EntityInfo = EntityInfo.create<ICostGroupEntity>({
    grid: {
        title: {key: 'basics.costgroups.listCostGroupTitle'},
        behavior: ctx => ctx.injector.get(BasicsCostGroupBehavior),
        treeConfiguration: ctx => {
            return {
                parent: function (entity: ICostGroupEntity) {
                    const service = ctx.injector.get(BasicsCostGroupDataService);
                    return service.parentOf(entity);
                },
                children: function (entity: ICostGroupEntity) {
                    const service = ctx.injector.get(BasicsCostGroupDataService);
                    return service.childrenOf(entity);
                }
            } as IGridTreeConfiguration<ICostGroupEntity>;
        }
    },
    form: {
        title: {key: 'basics.costgroups.detailCostGroupTitle'},
        containerUuid: 'ae907fe037404c529b869ac249530084',
    },
    dataService: ctx => ctx.injector.get(BasicsCostGroupDataService),
    validationService: (ctx) => ctx.injector.get(BasicsCostGroupValidationService),
    dtoSchemeId: {moduleSubModule: 'Basics.CostGroups', typeName: 'CostGroupDto'},
    permissionUuid: '53bbf195fca0c866020eb155e43db648',
    layoutConfiguration: {
        groups: [{
            gid: 'default',
            'attributes': ['Code', 'DescriptionInfo', 'Quantity', 'UomFk', 'ReferenceQuantityCode','LeadQuantityCalc','NoLeadQuantity','IsLive']
        }],
        overloads: {
            UomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true)
        },
        labels: {
            ...prefixAllTranslationKeys('cloud.common.', {
                Code: {key: 'entityCode'},
                DescriptionInfo: {key: 'entityDescription'},
                Quantity: {key: 'entityQuantity'},
                UomFk: {key: 'entityUoM'},
            }),
            ...prefixAllTranslationKeys('basics.costgroups.', {
                ReferenceQuantityCode: {key: 'referenceQuantityCode'},
                LeadQuantityCalc: {key: 'leadquantitycalc'},
                NoLeadQuantity: {key: 'noleadquantity'},
                IsLive: {key: 'islive'}
            }),
        },
    }
});
