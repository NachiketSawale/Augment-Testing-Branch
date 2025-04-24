/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BasicsClerkDataService } from '../services/basics-clerk-data.service';

export const BASICS_CLERK_CHARACTERISTIC_ENTITY_INFO: EntityInfo =  BasicsSharedCharacteristicDataEntityInfoFactory.create({
	permissionUuid: 'c2dd899746024732aa0fc583526f04eb',
	sectionId:BasicsCharacteristicSection.Clerk,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(BasicsClerkDataService);
	},
});
