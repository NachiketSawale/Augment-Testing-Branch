/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ControllingCommonPrcContractLayoutService, ControllingComomnPrcContractEntityInfoModel } from '@libs/controlling/common';
import { ControllingProjectcontrolsPrcContractDataService } from '../services/controlling-projectcontrols-prc-contract-data.service';
import { ControllingProjectcontrolsPrcContractBehaviorService } from '../behaviors/controlling-projectcontrols-prc-contract-behavior.service';

export const CONTROLLING_PROJECTCONTROLS_PRC_CONTRACT_ENTITY_INFO: EntityInfo = ControllingComomnPrcContractEntityInfoModel.create({
	permissionUuid: '681223e37d524ce0b9bfa2294e18d650',
	formUuid: '03acca50bd964ae798dcebe7e803f3a1',
	dataServiceToken: ControllingProjectcontrolsPrcContractDataService,
	layoutServiceToken: ControllingCommonPrcContractLayoutService,
	behavior: ControllingProjectcontrolsPrcContractBehaviorService,
});
