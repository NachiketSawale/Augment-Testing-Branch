/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ControllingCommonActualEntityInfoModel, ControllingCommonActualLayoutService } from '@libs/controlling/common';
import { ControllingProjectcontrolsActualDataService } from '../services/controlling-projectcontrols-actual-data.service';

export const CONTROLLING_PROJECTCONTROLS_ACTUAL_ENTITY_INFO: EntityInfo = ControllingCommonActualEntityInfoModel.create({
	permissionUuid: '519f57ab55da420694b4d52264db09b4',
	formUuid: 'a16b01f83445cb272f1d29745ec48e8b',
	dataServiceToken: ControllingProjectcontrolsActualDataService,
	layoutServiceToken: ControllingCommonActualLayoutService,
});
