/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsSharedLink2ClerkEntityInfoFactory } from '@libs/basics/shared';
import { MtwoControlTowerConfigurationItemDataService } from '../services/mtwo-control-tower-configuration-item-data.service';

/**
 * MTWO control tower configuration clerk entity info
 */
export const MTWO_CONTROL_TOWER_CONFIGURATION_CLERK_ENTITY_INFO: EntityInfo = BasicsSharedLink2ClerkEntityInfoFactory.create({
	permissionUuid: 'c12bb5c9dc5a4e66932eb6a067fca04b',
	gridContainerUuid: 'c12bb5c9dc5a4e66932eb6a067fca04b',
	gridTitle: 'mtwo.controltowerconfiguration.powerbiClerkList',
    formContainerUuid: '727518217adc4b498d1de298ed10ca1a',
	formTitle: 'basics.clerk.detailClerkAuthTitle',
	link2clerkDataServiceCreateContext: {
		qualifier: 'mtwo.controltower.clerk',
		parentServiceFn: (ctx) => {
			return ctx.injector.get(MtwoControlTowerConfigurationItemDataService);
		},
	},
});