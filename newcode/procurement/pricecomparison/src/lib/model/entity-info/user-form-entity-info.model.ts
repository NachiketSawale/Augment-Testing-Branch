/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedUserFormDataEntityInfoFactory, Rubric } from '@libs/basics/shared';
import { RfqHeaderEntityComplete } from '@libs/procurement/rfq';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { ProcurementPricecomparisonRfqHeaderDataService } from '../../services/rfq-header-data.service';

export const PRICE_COMPARISON_USER_FORM_ENTITY_INFO = BasicsSharedUserFormDataEntityInfoFactory.create<IRfqHeaderEntity, RfqHeaderEntityComplete>({
	rubric: Rubric.RFQs,
	permissionUuid: 'e9d2975ba1c843668eab2edacf1fc1bb',
	gridTitle: {
		key: 'cloud.common.ContainerUserformDefaultTitle'
	},

	parentServiceFn: (ctx) => {
		return ctx.injector.get(ProcurementPricecomparisonRfqHeaderDataService);
	},
});