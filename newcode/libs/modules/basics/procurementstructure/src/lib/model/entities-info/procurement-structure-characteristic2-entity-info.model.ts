/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { BasicsProcurementStructureDataService } from '../../procurement-structure/basics-procurement-structure-data.service';

/**
 * Entity info for procurement structure characteristic 2
 */
export const PROCUREMENT_STRUCTURE_CHARACTERISTIC2_ENTITY_INFO	= BasicsSharedCharacteristicDataEntityInfoFactory.create2({
	permissionUuid: 'a674943c0593443f9ea84743cb727932',
	sectionId: BasicsCharacteristicSection.PrcStructureCharacteristics2,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(BasicsProcurementStructureDataService);
	}
});