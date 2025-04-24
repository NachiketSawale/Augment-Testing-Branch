/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { PpsFormulaDataService } from '../services/pps-formula-data.service';
import { IPpsFormulaEntity } from './models';
import { PpsFormulaBehavior } from '../behaviors/pps-formula-behavior.service';
import {PpsFormulaLayoutConfiguration} from './pps-formula-layout-configuration';

export const PPS_FORMULA_ENTITY_INFO: EntityInfo = EntityInfo.create<IPpsFormulaEntity>({
    grid: {
        title: { key: 'productionplanning.formulaconfiguration.formula.listTitle' },
        behavior: ctx => ctx.injector.get(PpsFormulaBehavior),
    },
    form: {
        title: { key: 'productionplanning.formulaconfiguration.formula.detailTitle' },
        containerUuid: '462bbc55ac864fc2a2078ed568f4debd',
    },
    dataService: ctx => ctx.injector.get(PpsFormulaDataService),
    dtoSchemeId: { moduleSubModule: 'ProductionPlanning.FormulaConfiguration', typeName: 'PpsFormulaDto' },
    permissionUuid: '025e8f7c4d624f31bcc7d5a493bdbca4',
    layoutConfiguration: PpsFormulaLayoutConfiguration,
});