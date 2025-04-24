/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import {
	ControllingCommonPrcContractLayoutService,
	ControllingComomnPrcContractEntityInfoModel
} from '@libs/controlling/common';
import { ControllingStructureContractTotalDataService } from '../services/controlling-structure-contract-total-data.service';



export const CONTROLLING_STRUCTURE_CONTRACT_TOTAL_ENTITY_INFO : EntityInfo = ControllingComomnPrcContractEntityInfoModel.create({
	permissionUuid: '681223e37d524ce0b9bfa2294e18d650',
	formUuid:'03acca50bd964ae798dcebe7e803f3a1',
	dataServiceToken: ControllingStructureContractTotalDataService,
	layoutServiceToken:ControllingCommonPrcContractLayoutService,
	});
