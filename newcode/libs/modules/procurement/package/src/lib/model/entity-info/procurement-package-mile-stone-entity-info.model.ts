/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonMileStoneEntityInfo } from '@libs/procurement/common';
import { ProcurementPackageMileStoneDataService } from '../../services/procurement-package-mile-stone-data.service';

/**
 * Entity info for procurement Package milestone
 */
export const PROCUREMENT_PACKAGE_MILE_STONE_ENTITY_INFO = ProcurementCommonMileStoneEntityInfo.create({
	permissionUuid: 'd58e6439acb14016b269896987c1dff1',
	formUuid: 'edcde96fb9ad445f9c6869bb7fa7e69f',
	dataServiceToken: ProcurementPackageMileStoneDataService,
});
