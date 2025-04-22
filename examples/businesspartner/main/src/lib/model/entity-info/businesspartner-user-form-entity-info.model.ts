/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedUserFormDataEntityInfoFactory, Rubric } from '@libs/basics/shared';
import { IBusinessPartnerEntity } from '@libs/businesspartner/interfaces';
import { BusinessPartnerEntityComplete } from '../entities/businesspartner-entity-complete.class';
import { BusinesspartnerMainHeaderDataService } from '../../services/businesspartner-data.service';
import { IEntitySelection } from '@libs/platform/data-access';
import { IInitializationContext } from '@libs/platform/common';

export const BP_USER_FORM_ENTITY_INFO = BasicsSharedUserFormDataEntityInfoFactory.create<IBusinessPartnerEntity, BusinessPartnerEntityComplete>({
	rubric: Rubric.BusinessPartner,
	permissionUuid: '5e83dc4be236407e94844a77dbd33010',
	gridTitle: {
		key: 'businesspartner.main.formData'
	},
	parentServiceFn: (ctx) => {
		return ctx.injector.get(BusinesspartnerMainHeaderDataService);
	},
	isParentReadonly: (parentService: IEntitySelection<IBusinessPartnerEntity>, context: IInitializationContext) => {
		return context.injector.get(BusinesspartnerMainHeaderDataService).isStatusReadonly();
	}
});