/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonItemInfoBlEntityInfo } from '@libs/procurement/common';
import { ProcurementPackageItemInfoBlDataService } from '../../services/procurement-package-item-info-bl-data.service';


export const PROCUREMENT_PACKAGE_BASELINE_ITEM_ENTITY_INFO = ProcurementCommonItemInfoBlEntityInfo.create({
	permissionUuid: 'df33e839bf4c462190bac65b9035ad93',
	formUuid: '70ed545c2a96462fad76a11af539431a',
	dataServiceToken: ProcurementPackageItemInfoBlDataService,
});