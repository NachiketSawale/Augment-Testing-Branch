/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsProcurementStructureGeneralDataService } from './basics-procurement-structure-general-data.service';
import {BasicsProcurementStructureGeneralLayoutService} from './basics-procurement-structure-general-layout.service';
import { IPrcConfiguration2GeneralsEntity } from '../model/entities/prc-configuration-2-generals-entity.interface';

export const PROCUREMENT_STRUCTURE_GENERAL_ENTITY_INFO = EntityInfo.create<IPrcConfiguration2GeneralsEntity>({
    dtoSchemeId: {moduleSubModule: 'Basics.ProcurementStructure', typeName: 'PrcConfiguration2GeneralsDto'},
    permissionUuid: '818a69a775ee4be2abf5ae052a6a1870',
    grid: {
        title: {text: 'General', key: 'basics.procurementstructure.generalsContainerTitle'},
    },
    form: {
        containerUuid: '3558a8cbfd524e20a2ada6e8c5716fb9',
        title: {text: 'General Detail', key: 'basics.procurementstructure.generalsDetailContainerTitle'},
    },
    dataService: ctx => ctx.injector.get(BasicsProcurementStructureGeneralDataService),
    layoutConfiguration: context => {
        return context.injector.get(BasicsProcurementStructureGeneralLayoutService).generateLayout();
    }
});
