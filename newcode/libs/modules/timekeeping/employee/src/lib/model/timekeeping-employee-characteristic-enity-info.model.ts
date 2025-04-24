/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { TimekeepingEmployeeDataService } from '../services';

/**
 * Entity info for Timekeeping Employee characteristic
 */
export const TimekeepingEmployeeCharacteristicEnityInfoModel = BasicsSharedCharacteristicDataEntityInfoFactory.create({
	permissionUuid: '9af696fc260445b9b577c4681bf2f92a',
	sectionId: BasicsCharacteristicSection.TimekeepingEmployee,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(TimekeepingEmployeeDataService);
	},
});