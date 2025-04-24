/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
 
import { EntityInfo } from '@libs/ui/business-base';
import {
    ControllingCommonPesEntityInfoModel,
    ControllingCommonProjectComplete,
    IControllingCommonProjectEntity,
} from '@libs/controlling/common';

import {
    ControllingProjectControlsPesTotalDataService
} from '../services/controlling-project-controls-pes-total-data.service';
import {
    ControllingProjectControlsPesTotalBehavior
} from '../behaviors/controlling-project-controls-pes-total-behavior.service';
import {
    ControllingProjectControlsPesTotalEntity
} from './entities/controlling-projectcontrols-pes-total-entity-interface.class';

 export const CONTROLLING_PROJECT_CONTROLS_PES_TOTAL_ENTITY_INFO: EntityInfo =ControllingCommonPesEntityInfoModel.create<ControllingProjectControlsPesTotalEntity,IControllingCommonProjectEntity,ControllingCommonProjectComplete>({
     permissionUuid: '9fe07bf7c81e4d45a680400d5aa47c88',
     formUuid: '9fe07bf7c81e4d45a680400d5aa47c88',
     moduleSubModule: 'Procurement.Pes',
     typeName: 'PesControllingTotalDto',
     dataServiceToken: ControllingProjectControlsPesTotalDataService,
     behavior: ControllingProjectControlsPesTotalBehavior
 });