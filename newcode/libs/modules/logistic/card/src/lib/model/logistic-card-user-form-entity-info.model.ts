/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedUserFormDataEntityInfoFactory, Rubric } from '@libs/basics/shared';
import { ILogisticCardEntity } from '@libs/logistic/interfaces';
import { LogisticCardComplete } from './logistic-card-complete.class';
import { LogisticCardDataService } from '../services/logistic-card-data.service';

export const LOGISTIC_CARD_USER_FORM_ENTITY_INFO = BasicsSharedUserFormDataEntityInfoFactory.create<ILogisticCardEntity, LogisticCardComplete>({
	rubric: Rubric.LogisticJobCard,
	permissionUuid: 'b8faa20ce88111eb9a030242ac130003',
	gridTitle: {
		key: 'cloud.common.ContainerUserformDefaultTitle'
	},

	parentServiceFn: (ctx) => {
		return ctx.injector.get(LogisticCardDataService);
	},
});