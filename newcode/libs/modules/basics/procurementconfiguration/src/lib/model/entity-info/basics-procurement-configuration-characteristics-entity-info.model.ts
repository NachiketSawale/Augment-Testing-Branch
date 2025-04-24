/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { BasicsProcurementConfigConfigurationDataService } from '../../services/basics-procurement-config-configuration-data.service';

/**
 * Entity info for procurement configuration characteristics
 */
export const BASICS_PROCUREMENT_CONFIGURATION_CHARACTERISTICS_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create({
	permissionUuid: 'c3aff3a8709446c78ee23ef72967d81a',
	containerUuid: 'f18e9e9e0e014596b586b9aa5a736c38',
	sectionId: BasicsCharacteristicSection.ProcurementConfiguration,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(BasicsProcurementConfigConfigurationDataService);
	},
});
