/*
 * Copyright(c) RIB Software GmbH
 */

import { ControllingSharedGroupSetEntityInfo } from '@libs/controlling/shared';
import { ProcurementContractItemDataService } from '../../services/procurement-contract-item-data.service';
import { IConItemEntity } from '../entities';

export const PROCUREMENT_CONTRACT_CONTROLLING_GROUP_SET_ENTITY_INFO = ControllingSharedGroupSetEntityInfo.create({
	permissionUuid: '4b2c873526cc4f8c8e8b652cfda4f8fe',
	formUuid: '69940aaa863843c3accc5bbe1c6fd2c2',
	parentService: ProcurementContractItemDataService,
	getBasItemTypeId: (parent: IConItemEntity) => parent.BasItemTypeFk
});