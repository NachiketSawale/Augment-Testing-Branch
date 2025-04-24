/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsCostCodesDataService } from '../services/data-service/basics-cost-codes-data.service';
import { ICostCodeEntity } from './models';
import { IGridTreeConfiguration } from '@libs/ui/common';
import { BasicsCostCodesBehavior } from '../services/behaviors/basics-cost-codes-behavior.service';
import { BasicsCostCodesDetailsBehavior } from '../services/behaviors/basics-cost-codes-details-behavior.service';
import { BasicsCostCodesLayoutService } from '../services/layout/basics-cost-codes-layout.service';
import { BasicsCostcodesValidationService } from '../services/validation/basics-cost-codes-validation.service';
import { BasicsCostCodesDragDropService } from '../services/drag-drop/basics-cost-codes-drag-drop.service';

export const BASICS_COST_CODES_ENTITY_INFO: EntityInfo = EntityInfo.create<ICostCodeEntity>({
    grid: {
        title: { key: 'basics.costcodes' + '.costCodes' },
        containerUuid: 'ceeb3a8d7f3e41aba9aa126c7a802f87',
        behavior: (ctx) => ctx.injector.get(BasicsCostCodesBehavior),
        treeConfiguration: (ctx) => {
            return {
                parent: function (entity: ICostCodeEntity) {
                    const service = ctx.injector.get(BasicsCostCodesDataService);
                    return service.parentOf(entity);
                },
                children: function (entity: ICostCodeEntity) {
                    const service = ctx.injector.get(BasicsCostCodesDataService);
                    return service.childrenOf(entity);
                }
            } as IGridTreeConfiguration<ICostCodeEntity>;
        }
    },
    form: {
        title: { key: 'basics.costcodes' + '.costCodesDetails' },
        containerUuid: 'ef116ab75a4246bf98055f17833c6db1',
        behavior: (ctx) => ctx.injector.get(BasicsCostCodesDetailsBehavior)
    },
    dataService: (ctx) => ctx.injector.get(BasicsCostCodesDataService),
	dragDropService:  (ctx) => ctx.injector.get(BasicsCostCodesDragDropService),
    validationService: (ctx) => ctx.injector.get(BasicsCostcodesValidationService),
    dtoSchemeId: { moduleSubModule: 'Basics.CostCodes', typeName: 'CostCodeDto' },
    permissionUuid: 'ceeb3a8d7f3e41aba9aa126c7a802f87',
    layoutConfiguration: (context) => {
        return context.injector.get(BasicsCostCodesLayoutService).generateConfig();
    }
});
