/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { BusinesspartnerContactDataService } from '../../services/businesspartner-contact-data.service';

/**
 * Entity info for business partner main contact characteristics
 */
export const BUSINESS_PARTNER_CONTACT_CHARACTERISTIC_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create({
	permissionUuid: 'a072433d39d6459f8ffae73e4ec7026f',
	sectionId: BasicsCharacteristicSection.Contact,
	gridTitle:'businesspartner.main.contactCharacteristicContainerTitle',
	parentServiceFn: (ctx) => {
		return ctx.injector.get(BusinesspartnerContactDataService);
	},
});
