/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedUserFormDataEntityInfoFactory, Rubric } from '@libs/basics/shared';
import { IContactEntityComplete } from '@libs/businesspartner/common';
import { ContactDataService } from '../../services/contact-data.service';
import { IContactEntity } from '@libs/businesspartner/interfaces';


/**
 * Contact Form Data Entity Info
 */
export const CONTACT_FORM_DATA_ENTITY_INFO = BasicsSharedUserFormDataEntityInfoFactory.create<IContactEntity, IContactEntityComplete>({
	rubric: Rubric.Contact,
	permissionUuid: '791481c3c29d4e7ca10030977895ff83',
	gridTitle: {
		key: 'businesspartner.main.contactFormData'
	},
	parentServiceFn: (ctx) => {
		return ctx.injector.get(ContactDataService);
	}
});