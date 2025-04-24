/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IPpsFormulaVersionEntity } from './models';
import { PpsFormulaVersionBehavior } from '../behaviors/pps-formula-version-behavior.service';
import { PpsFormulaVersionDataService } from '../services/pps-formula-version-data.service';
import {PpsFormulaVersionLayoutConfiguration} from './pps-formula-version-layout-configuration';

export const PPS_FORMULA_VERSION_ENTITY_INFO: EntityInfo = EntityInfo.create<IPpsFormulaVersionEntity>({
    grid: {
        title: { key: 'productionplanning.formulaconfiguration.version.listTitle' },
        behavior: ctx => ctx.injector.get(PpsFormulaVersionBehavior),
    },
    dataService: ctx => ctx.injector.get(PpsFormulaVersionDataService),
    dtoSchemeId: { moduleSubModule: 'ProductionPlanning.FormulaConfiguration', typeName: 'PpsFormulaVersionDto' },
    permissionUuid: '210f7e368bfc4cea8d34d6ff2dec36c4',
    layoutConfiguration: PpsFormulaVersionLayoutConfiguration,
});