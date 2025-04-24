/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
 
import { CONTROLLING_GENERAL_CONTRACTOR_PES_HEADER_BEHAVIOR_TOKEN } from '../behaviors/controlling-general-contractor-pes-header-behavior.service';
import {
    CONTROLLING_GENERAL_CONTRACTOR_PES_HEADER_DATA_TOKEN
} from '../services/controlling-general-contractor-pes-header-data.service';
import {EntityInfo} from '@libs/ui/business-base';
import { ControllingCommonPesEntityInfoModel} from '@libs/controlling/common';


 export const CONTROLLING_GENERAL_CONTRACTOR_PES_HEADER_ENTITY_INFO: EntityInfo = ControllingCommonPesEntityInfoModel.create({
     permissionUuid: '9fe07bf7c81e4d45a680400d5aa47c88',
     formUuid: '9fe07bf7c81e4d45a680400d5aa47c88',
     moduleSubModule: 'Controlling.GeneralContractor',
     typeName: 'PesHeaderCompeleteDto',
     dataServiceToken: CONTROLLING_GENERAL_CONTRACTOR_PES_HEADER_DATA_TOKEN,
     behavior: CONTROLLING_GENERAL_CONTRACTOR_PES_HEADER_BEHAVIOR_TOKEN
 });
