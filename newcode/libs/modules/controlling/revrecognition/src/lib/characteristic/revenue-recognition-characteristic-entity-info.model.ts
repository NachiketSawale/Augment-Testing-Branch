/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { ControllingRevenueRecognitionDataService } from '../revenue-recognition/revenue-recognition-data.service';

/**
 * Entity info for revenue recognition characteristic
 */
export const REVENUE_RECOGNITION_CHARACTERISTIC_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create({
	permissionUuid: 'dfbf5212e68e491d8e0959590a1bceb0',
	sectionId: BasicsCharacteristicSection.RevenueRecognitionCharacteristic,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(ControllingRevenueRecognitionDataService);
	},
});
