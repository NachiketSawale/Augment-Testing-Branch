/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { ProcurementPackageHeaderDataService } from '../../services/package-header-data.service';

/**
 * Entity info for procurement package characteristic 2
 */
export const PROCUREMENT_PACKAGE_CHARACTERISTIC2_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create2({
	permissionUuid: '7abb35f1ed574bc4b59bfa151c08f789',
    gridTitle:'basics.common.characteristic2.title',
	sectionId: BasicsCharacteristicSection.PackageCharacteristics2,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(ProcurementPackageHeaderDataService);
	}
});