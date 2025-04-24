/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ControllingCommonLineItemEntityInfoModel } from '@libs/controlling/common';
import { ControllingProjectcontrolsLineItemDataService } from '../services/controlling-projectcontrols-line-item-data.service';
import { ControllingProjectcontrolsLineItemBehaviorService } from '../behaviors/controlling-projectcontrols-line-item-behavior.service';

export const CONTROLLING_PROJECTCONTROLS_LINE_ITEM_ENTITY_INFO: EntityInfo = ControllingCommonLineItemEntityInfoModel.create({
	formUuid: 'dd3e613e6e0434987d7f117c3ed8541',
	permissionUuid: '681223e37d524ce0b9bfa2294e18d650',
	dataServiceToken: ControllingProjectcontrolsLineItemDataService,
	behavior: ControllingProjectcontrolsLineItemBehaviorService,
});
