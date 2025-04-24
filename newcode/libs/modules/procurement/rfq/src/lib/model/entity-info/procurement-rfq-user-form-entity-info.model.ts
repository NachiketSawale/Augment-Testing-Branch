/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsSharedUserFormDataEntityInfoFactory, Rubric } from '@libs/basics/shared';
import { ProcurementRfqHeaderMainDataService } from '../../services/procurement-rfq-header-main-data.service';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { RfqHeaderEntityComplete } from '../entities/rfq-header-entity-complete.class';

/**
 * Procurement RFQ User form entity info model
 */
export const PROCUREMENT_RFQ_USER_FORM_ENTITY_INFO = BasicsSharedUserFormDataEntityInfoFactory.create<IRfqHeaderEntity, RfqHeaderEntityComplete>({
	rubric: Rubric.RFQs,
	permissionUuid: '64BFB8A2501645CF873BDC33EC0DB7DA',
	gridTitle: {
		key: 'cloud.common.ContainerUserformDefaultTitle'
	},

	parentServiceFn: (ctx) => {
		return ctx.injector.get(ProcurementRfqHeaderMainDataService);
	},
});