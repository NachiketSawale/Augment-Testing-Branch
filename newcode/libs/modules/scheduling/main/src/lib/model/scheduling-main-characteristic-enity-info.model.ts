/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { SchedulingMainDataService } from '../services/scheduling-main-data.service';
/**
 * Entity info for Timekeeping Employee characteristic
 */
export const SchedulingMainCharacteristicEnityInfoModel = BasicsSharedCharacteristicDataEntityInfoFactory.create({
	permissionUuid: 'c4f6e415194d44d49b995d4f2f4e8a69',
	sectionId: 12,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(SchedulingMainDataService);
	},
});