/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { BasicsProcurementConfigConfigurationDataService } from '../../services/basics-procurement-config-configuration-data.service';

/**
 * Entity info for procurement configuration characteristic 2
 */
export const PROCUREMENT_CONFIGURATION_CHARACTERISTIC2_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create2({
	permissionUuid: '6aea681373e24c1bb13682a56cdb7553',
	sectionId: BasicsCharacteristicSection.PrcConfigurationCharacteristics2,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(BasicsProcurementConfigConfigurationDataService);
	},
});
