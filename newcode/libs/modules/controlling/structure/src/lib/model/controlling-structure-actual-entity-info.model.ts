/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ControllingStructureActualDataService } from '../services/controlling-structure-actual-data.service';
import { ControllingCommonActualEntityInfoModel, ControllingCommonActualLayoutService } from '@libs/controlling/common';


export const CONTROLLING_STRUCTURE_ACTUAL_ENTITY_INFO: EntityInfo = ControllingCommonActualEntityInfoModel.create({
	permissionUuid: '519f57ab55da420694b4d52264db09b4',
	formUuid: 'a16b01f83445cb272f1d29745ec48e8b',
	dataServiceToken: ControllingStructureActualDataService,
	layoutServiceToken: ControllingCommonActualLayoutService
});

