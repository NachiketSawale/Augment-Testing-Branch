/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { SchedulingTemplateMainDataService } from '../services/scheduling-template-main-data.service';

/**
 * Entity info for Scheduling Template characteristic
 */
export const SCHEDULING_TEMPLATE_ACTIVITY_CHARACTERISTIC_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create({
	permissionUuid: '8724f845940c46c4b2767ad4109b345d',
	sectionId: BasicsCharacteristicSection.ActivityTemplate,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(SchedulingTemplateMainDataService);
	},
});