import {EntityInfo} from '@libs/ui/business-base';
import {IGccActualVEntity} from './entities/gcc-actual-ventity.interface';
import {
    ControllingGeneralContractorActualsBehaviorService
} from '../behaviors/controlling-general-contractor-actuals-behavior.service';
import {
    ControllingGeneralContractorActualsDataService
} from '../services/controlling-general-contractor-actuals-data.service';

import {ControllingCommonActualExtendLayoutService} from '@libs/controlling/common';

export const controllingGeneralContractorActualsEntityInfoModel : EntityInfo = EntityInfo.create<IGccActualVEntity> ({
    grid: {
        title: {text: 'Actuals', key: 'controlling.generalcontractor.ActualTitle'},
        containerUuid:'c20856f7ecf44b1ca2e68defb7d1fd7f',
        behavior: ctx => ctx.injector.get(ControllingGeneralContractorActualsBehaviorService),
    },

    dtoSchemeId: {
        moduleSubModule: 'Controlling.GeneralContractor',
        typeName: 'GccActualVDto'
    },
    dataService: ctx => ctx.injector.get(ControllingGeneralContractorActualsDataService),
    permissionUuid: '363147351c1a426b82e3890cf661493d',
    layoutConfiguration:context => {
        return context.injector.get(ControllingCommonActualExtendLayoutService).generateLayout();
    }
});