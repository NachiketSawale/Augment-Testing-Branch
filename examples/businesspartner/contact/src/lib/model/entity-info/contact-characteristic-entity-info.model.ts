/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { ContactDataService } from '../../services/contact-data.service';

/**
 * Entity info for business partner contact characteristics
 */
export const CONTACT_CHARACTERISTIC_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create({
	permissionUuid: 'a072433d39d6459f8ffae73e4ec7026f',
	sectionId: BasicsCharacteristicSection.Contact,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(ContactDataService);
	},
});
