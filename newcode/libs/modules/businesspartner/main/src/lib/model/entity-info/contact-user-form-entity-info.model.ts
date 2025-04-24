/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedUserFormDataEntityInfoFactory, Rubric } from '@libs/basics/shared';
import { IContactEntityComplete } from '@libs/businesspartner/common';
import { IContactEntity } from '@libs/businesspartner/interfaces';
import { BusinesspartnerContactDataService } from '../../services/businesspartner-contact-data.service';

export const CONTACT_USER_FORM_ENTITY_INFO = BasicsSharedUserFormDataEntityInfoFactory.create<IContactEntity, IContactEntityComplete>({
	rubric: Rubric.Contact,
	permissionUuid: '791481c3c29d4e7ca10030977895ff83',
	gridTitle: {
		key: 'businesspartner.main.contactFormData'
	},
	parentServiceFn: (ctx) => {
		return ctx.injector.get(BusinesspartnerContactDataService);
	},
	disabledChangeStatusViaWizard: true
});