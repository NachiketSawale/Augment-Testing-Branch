/*
 * Copyright(c) RIB Software GmbH
 */

import { ControllingSharedGroupSetEntityInfo } from '@libs/controlling/shared';
import { ProcurementPackageItemDataService } from '../../services/procurement-package-item-data.service';

export const PROCUREMENT_PACKAGE_CONTROLLING_GROUP_SET_ENTITY_INFO = ControllingSharedGroupSetEntityInfo.create({
	permissionUuid: 'c1a994b958264b50ad96ab3ada257af3',
	formUuid: '01a4fbbdbb014f62bc01b0bb06d4f8ee',
	parentService: ProcurementPackageItemDataService,
});
