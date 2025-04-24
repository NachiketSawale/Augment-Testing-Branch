/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IPpsFormulaInstanceEntity } from './models';
import { PpsFormulaInstanceBehavior } from '../behaviors/pps-formula-instance-behavior.service';
import { PpsFormulaInstanceDataService } from '../services/pps-formula-instance-data.service';
import {PpsFormulaInstanceLayoutConfiguration} from './pps-formula-instance-layout-configuration';
import {PpsFormulaInstanceValidationService} from '../services/pps-formula-instance-validation.service';

export const PPS_FORMULA_INSTANCE_ENTITY_INFO: EntityInfo = EntityInfo.create<IPpsFormulaInstanceEntity>({
    grid: {
        title: { key: 'productionplanning.formulaconfiguration.instance.listTitle' },
        behavior: ctx => ctx.injector.get(PpsFormulaInstanceBehavior),
    },
    dataService: ctx => ctx.injector.get(PpsFormulaInstanceDataService),
    dtoSchemeId: { moduleSubModule: 'ProductionPlanning.FormulaConfiguration', typeName: 'PpsFormulaInstanceDto' },
    permissionUuid: 'bdfa67ea15424bf6b1ab28198b420e4e',
    layoutConfiguration: PpsFormulaInstanceLayoutConfiguration,
    validationService: context => context.injector.get(PpsFormulaInstanceValidationService)
});