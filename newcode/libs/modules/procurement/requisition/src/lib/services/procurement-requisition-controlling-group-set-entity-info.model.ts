/*
 * Copyright(c) RIB Software GmbH
 */

import { ControllingSharedGroupSetEntityInfo } from '@libs/controlling/shared';
import { RequisitionItemsDataService } from './requisition-items-data.service';

export const PROCUREMENT_REQUISITION_CONTROLLING_GROUP_SET_ENTITY_INFO = ControllingSharedGroupSetEntityInfo.create({
	permissionUuid: 'ac00c6d1a5d04cd59023fadfc43d7746',
	formUuid: '05ff4697949d4ba784545a1f6acf42dc',
	parentService: RequisitionItemsDataService,
});
