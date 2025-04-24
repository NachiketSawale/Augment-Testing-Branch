/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ControllingStructurePesTotalDataService } from '../services/controlling-structure-pes-total-data.service';
import { ControllingCommonPesEntityInfoModel } from '@libs/controlling/common';
import {
    ControllingCommonProjectComplete,
    IControllingCommonProjectEntity,
} from '@libs/controlling/common';
import { ControllingStructurePesTotalEntity } from './entities/controlling-structure-pes-total-entity-interface';


export const CONTROLLING_STRUCTURE_PES_TOTAL_ENTITY_INFO: EntityInfo =ControllingCommonPesEntityInfoModel.create<ControllingStructurePesTotalEntity,IControllingCommonProjectEntity,ControllingCommonProjectComplete>({
	permissionUuid: '9fe07bf7c81e4d45a680400d5aa47c88',
	formUuid: '9fe07bf7c81e4d45a680400d5aa47c88',
	moduleSubModule: 'Procurement.Pes',
	typeName: 'PesControllingTotalDto',
	dataServiceToken: ControllingStructurePesTotalDataService,
});
