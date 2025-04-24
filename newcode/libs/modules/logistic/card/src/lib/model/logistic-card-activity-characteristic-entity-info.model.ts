/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { LogisticCardActivityDataService } from '../services/logistic-card-activity-data.service';

/**
 * Entity info for logistic card activity characteristic
 */
export const LOGISTIC_CARD_ACTIVITY_CHARACTERISTIC_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create({
	gridTitle: {key: 'logistic.card.activityCharacteristicsContainerTitle'},
	permissionUuid: 'a807ecc8fdb047bd9ce4d3a32e8e7ca2',
	sectionId: BasicsCharacteristicSection.LogisticActivityCharacteristic,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(LogisticCardActivityDataService);
	},
});
